## What is Cybersecurity?
Cybersecurity is the art of protecting networks, devices, and data (basically everything digital) from unauthorized access or criminal use.

And that’s through various methods, from simply **hardening the devices (Blue Side)**, **Setting policies (GRC)**, or even **attacking those devices (Red Teaming)**.

---
## Importance of Cybersecurity
- According to a [2025 study](https://www.helpnetsecurity.com/2024/09/24/jon-france-isc2-cybersecurity-workforce/) by the International Information System Security Certification Consortium (ISC)², the global cybersecurity workforce gap is approximately 4.8 million professionals.

- The average cost of a global data breach in 2024 was about **$4.88 million**, and cybercrime is projected to cost approximately **$10.5 trillion** in 2025.

- Entry-level could already be six-figures (USD) in the US. With certification + hands-on skills + the right region you could be aiming at US $140k+ or European €80k-€100k in a few years.
---
## Relevance of Cybersecurity in Real Life
To better understand how important cybersec is, we need to link it to real world examples.
Here are some of the most famous attacks in the cybersecurity history, which caused billions of Dollars in damages, and sometimes even lead to the death of some people!

- [Stuxnet (2010)](https://en.wikipedia.org/wiki/Stuxnet) – A highly sophisticated worm believed to be developed jointly by the U.S. and Israel. It targeted Iran’s nuclear centrifuges, causing them to malfunction while hiding the sabotage. It marked the first known digital weapon to cause physical destruction, redefining cyberwarfare forever.

- [NotPetya (2017)](https://en.wikipedia.org/wiki/Petya_(malware_family)) – Originating from a compromised Ukrainian software update, this wiper malware spread globally, crippling corporations such as Maersk, FedEx, and Merck. The total economic impact exceeded $10 billion, making it one of the most costly cyber attacks in history.
---
## Paths of Cybersecurity
Paths in cybersecurity can be **simplified/generalized** to 3 main paths:
### 1. Blue Team: The Shield (Defensive Operations)
The Blue Team is the backbone of most organizations. Their primary goal is to **defend** against ongoing threats and build a resilient infrastructure. Professionals in this path monitor networks for suspicious activity, respond to security incidents, and patch vulnerabilities before they can be exploited.
- **Common Roles:** SOC Analyst, Incident Responder, Digital Forensics Specialist.
- **Key Focus:** Detection, mitigation, and recovery.
### 2. Red Team: The Sword (Offensive Security)
Red Teaming involves taking an offensive approach to security by **simulating real-world attacks**. By thinking like a hacker, these professionals test the effectiveness of the Blue Team’s defenses. This path isn't just about "breaking in"; it’s about providing actionable insights to help the organization close security gaps.
- **Common Roles:** Penetration Tester, Ethical Hacker, Vulnerability Researcher.
- **Key Focus:** Exploitation, infiltration, and testing limits.
### 3. GRC: The Rulebook (Governance, Risk, and Compliance)
GRC is the strategic side of cybersecurity that focuses on the **big picture**. Instead of looking at code or logs, GRC professionals look at law, policy, and risk management. They ensure the organization stays compliant with international standards (like [ISO 27001](https://www.iso.org/standard/27001) or [GDPR](https://gdpr-info.eu/)) and that security risks are aligned with business goals.
- **Common Roles:** Security Auditor, Compliance Officer, IT Risk Manager.
- **Key Focus:** Policy-making, legal compliance, and risk assessment.

> <u><b>Note:</b></u> By the way we have [**Loi n° 18-07**](https://www.arpce.dz/fr/pub/c7e6n6).
---
## What is a CTF (Capture the Flag)?

In the world of cybersecurity, a **Capture The Flag (CTF)** is a competitive exercise where you hunt for hidden pieces of data called "flags." Think of it as a digital treasure hunt—instead of physical flags, you’re looking for specific strings of text (like `flag{h4ck_th3_pl4n3t}`) hidden inside vulnerable systems or encrypted files.

CTFs effectively **gamify cybersecurity**. They take complex, intimidating hacking techniques and turn them into a series of puzzles. Over the last decade, their popularity has exploded because they offer a safe, legal, and incredibly fun environment to practice "breaking" things.

---
## Types of CTF Competitions

Most CTFs fall into two main categories:
### 1. Jeopardy-style (The Classic)

Like the TV show, you are presented with a board of challenges across different categories (Web, Crypto, Pwn, etc.). Each challenge has a point value based on its difficulty. You solve them at your own pace, submit the flag, and climb the leaderboard. This is the **best format for beginners**.

### 2. Attack-Defense (The Warzone)

This is much more intense! Every team is given an identical, vulnerable server. Your job is twofold: **Attack** other teams to steal their flags while simultaneously **Defending** your own server by patching bugs. It’s a real-time simulation of cyber warfare.

---
## Why Should You Participate?

CTFs aren't just for "nerds" - they are one of the fastest ways to level up your career.
- **Hands-on Skill Building:** You move past theory and actually use tools like Burp Suite, Wireshark, and Ghidra. If you break a lab, no one gets sued!
- **Career Gold:** Employers _love_ seeing CTF experience. It proves you have the persistence to solve hard problems and the curiosity to learn outside of a classroom.
- **Prizes & Glory:** High-level CTFs offer "Black Badges" (lifetime conference passes), cash prizes, or even job offers on the spot. Even in smaller events, the "aha!" moment of finding a flag is a massive dopamine hit.
- **Ethical Mindset:** CTFs teach you how hackers think, so you can build better defenses.
And without forgetting the most important factor... they're **FUN**

---
## Common CTF Categories

The main & most common CTF categories are:

| **Category**                  | **What you do**                                                                           | **Key Tools**        |
| ----------------------------- | ----------------------------------------------------------------------------------------- | -------------------- |
| **Web Exploitation**          | Finding bugs in websites (SQLi, XSS, IDOR).                                               | Burp Suite, DevTools |
| **Cryptography**              | Breaking ciphers and decrypting secret messages.                                          | CyberChef, Python    |
| **Reverse Engineering**       | Taking a program apart to see how it works, basically reverse software engineering.       | Ghidra, IDA Pro      |
| **Binary Exploitation (Pwn)** | Tricking a program into running your own code generally through memory corruption errors. | GDB, pwntools        |
| **Forensics**                 | Playing "المحقق كونان" with memory and files.                                             | Wireshark, Autopsy   |

You'll find some other secondary categories like:
- **OSINT (Open Source Intelligence):** Looking up real stuff (people, locations, ...) through publically accessible information, i.e. basically **stalking**.
-  **Misc (miscellaneous):** challenges too weird/broad that they can't be categorized into any traditional category
-  **AI (Artificial Intelligence):** You basically hack models & stuff like that, a rapidly rising field
-  **Blockchain:** Finding vulnerabilities in the implementation of blockchain, hacking transactions

---
## Where to Start Practicing?

You don’t have to wait for a big event to start hacking. Here are the best "gyms" to train in:

- **[picoCTF](https://picoctf.org/):** Created by CMU specifically for beginners. Very friendly and educational.
- **[OverTheWire](https://overthewire.org/wargames/):** The gold standard for learning the Linux command line through challenges.
- **[TryHackMe](https://tryhackme.com/):** Guided "rooms" that walk you through attacks step-by-step. Great for visual learners.
- **[Hack The Box](https://www.hackthebox.com/):** A bit more advanced—real-world virtual machines that you need to fully compromise.
- **[CTFtime](https://ctftime.org/):** The "ESPN" of CTFs. Use this to find upcoming live competitions and read "write-ups" (solutions) from past games.

## Final Notes

Cybersecurity is one of the always-advancing fields, and one of of the most rewarding if managed well.

So my final advice for y'all, never stop learning, always improve, and Incha'Allah you'll all reach your goals.