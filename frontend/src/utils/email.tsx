async function sendEmail(toName: string, toDomain: string) {
  return (
    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${toName}%40${toDomain}&cc=sepolia%40sendeth.org&su=Send%205%20TEST%20to%20contact.dhruvagarwal%40gmail.com&body=You%20are%20sending%20with%20Email%20Wallet.%0A%0A%E2%9D%97%20This%20transaction%20is%20triggered%20when%20you%20send%20this%20email.%20Don%27t%20edit%20the%20cc%3A%20or%20subject%3A%20fields%2C%20or%20else%20it%20will%20fail!%0A%0A%F0%9F%93%A4%20sendeth.org%20(cc%27d)%20relays%20your%20email%20on%20Sepolia%20testnet%20to%20transfer%20the%20funds.%20Expect%20a%20confirmation%20email%20when%20finished.%0A%0A%F0%9F%93%96%20Read%20more%20on%20our%20site%2C%20docs%2C%20or%20code%20at%20https%3A%2F%2Femailwallet.org"></a>
  );
}
