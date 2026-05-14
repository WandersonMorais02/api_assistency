export function generateProtocol() {
  const date = new Date();

  const year = date.getFullYear();

  const random = Math.floor(100000 + Math.random() * 900000);

  return `OS-${year}-${random}`;
}
