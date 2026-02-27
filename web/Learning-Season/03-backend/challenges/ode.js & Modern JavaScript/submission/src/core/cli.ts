import type { ICliService } from '../interfaces.js';
import { buildWeatherCommand } from './weather-command.js';
import type { WeatherService } from './weather.js';
import repl from 'node:repl';

export class CliService implements ICliService {
  constructor(private weatherClient: WeatherService) {}
  private _inline: boolean = false;

  inline() {
    this._inline = true;
    return this;
  }

  async run(): Promise<void> {
    if (this._inline) {
      await this.runInline();
    } else {
      await this.runInteractive();
    }
  }

  private async runInline(args?: string[]): Promise<void> {
    const program = buildWeatherCommand(this.weatherClient);
    program.name('weather').description('Weather CLI tool').version('1.0.0');
    if (args) {
      await program.parseAsync(args, { from: 'user' });
    } else {
      await program.parseAsync();
    }
  }

  private async runInteractive(): Promise<void> {
    return new Promise((resolve) => {
      console.log('--- Interactive Weather Mode ---');
      console.log('Type "weather <location> [options]", "help", or "exit".\n');

      const replServer = repl.start({
        prompt: 'weather-cli> ',
        ignoreUndefined: true,
        eval: async (cmd, _context, _filename, callback) => {
          const input = cmd.trim();
          const [command, ...rest] = input.split(' ');

          switch (command) {
            case '':
              break;

            case 'exit':
              replServer.close();
              break;

            case 'help':
              console.log('Usage: weather <location> [options]');
              console.log('Options:');
              console.log(
                '  -H, --hourly [n]   Show hourly forecast (default: 4 hours)',
              );
              console.log(
                '  -d, --daily [n]    Show daily forecast (default: 7 days)',
              );
              console.log('  --no-cache         Disable cache');
              console.log('\nCommands: weather, help, exit\n');
              break;

            case 'weather': {
              try {
                const args = rest.flatMap(
                  (a) => a.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [],
                );
                await this.runInline(args);
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : String(error);
                console.error(`❌ ${message}`);
              }
              break;
            }

            default:
              console.error(
                `Unknown command: "${command}". Type "help" for usage.`,
              );
          }

          callback(null, undefined);
        },
      });

      replServer.on('exit', () => {
        console.log('\nGoodbye!');
        resolve();
      });
    });
  }
}
