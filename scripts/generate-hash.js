const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Ingresa la contraseña a hashear: ', (password) => {
  if (!password || password.length < 6) {
    console.log('Error: La contraseña debe tener al menos 6 caracteres');
    rl.close();
    process.exit(1);
  }

  // Generar hash con salt rounds de 10 (seguro y rápido)
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error al generar hash:', err);
      rl.close();
      process.exit(1);
    }

    console.log('\n✅ Hash generado exitosamente:');
    console.log(hash);
    console.log('\n📝 Copia este hash en tu variable de entorno NEXT_PUBLIC_USERS');
    console.log('⚠️  Nunca compartas contraseñas en texto plano\n');
    
    rl.close();
  });
});
