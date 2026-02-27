async function getIpAddress() {
  const res = await fetch('https://api.ipify.org');
  if (!res.ok) {
    throw new Error(`Failed to get IP address: ${res.statusText}`);
  }
  return (await res.text()).trim();
}

export async function detectCity() {
  const ip = await getIpAddress();
  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const data = (await res.json()) as any;

  if (!res.ok) {
    throw new Error(
      `Failed to detect location: ${data.error?.message || res.statusText}`,
    );
  }

  if (!data || !data.city) {
    throw new Error('Unable to detect location');
  }

  return data.city;
}
