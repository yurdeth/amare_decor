const bcrypt = require('bcryptjs');

const password = 'AllyMeli';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error al generar hash:', err);
    process.exit(1);
  }

  console.log('✅ Hash generado exitosamente:');
  console.log(hash);
  console.log('\n📝 Formato de hash:', hash.substring(0, 7));
  console.log('🔍 Contraseña:', password);

  process.exit(0);
});
