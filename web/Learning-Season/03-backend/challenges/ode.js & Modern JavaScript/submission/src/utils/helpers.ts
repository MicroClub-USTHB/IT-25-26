const IPAPI_KEY = process.env.IPAPI_KEY;

export async function detectCity() {
  const res = await fetch(
    `https://api.ipapi.com/api/check/?access_key=${IPAPI_KEY}`,
  );
  const data = (await res.json()) as any;

  if (!res.ok || !data || !data.city) {
    throw new Error('Unable to detect location');
  }

  return data.city;
}
