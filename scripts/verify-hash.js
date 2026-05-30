const bcrypt = require('bcryptjs');

const password = 'AllyMeli';
const hash = '$2b$10$7w/.0Cx9LlOMxZJOXAjmm.D9Ixz.WWHg.vgDs6f8/4GOl42CjjzZm';

console.log('🔐 Verificando contraseña y hash...');
console.log('Contraseña:', password);
console.log('Hash:', hash);

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('❌ Error en bcrypt.compare:', err);
    process.exit(1);
  }

  console.log('Resultado de bcrypt.compare:', result);

  if (result) {
    console.log('✅ La contraseña coincide con la hash');
  } else {
    console.log('❌ La contraseña NO coincide con la hash');
    console.log('Intentando generar una nueva hash...');

    bcrypt.hash(password, 10, (err, newHash) => {
      if (err) {
        console.error('❌ Error al generar nueva hash:', err);
        process.exit(1);
      }

      console.log('Nueva hash generada:', newHash);

      bcrypt.compare(password, newHash, (err, newResult) => {
        if (err) {
          console.error('❌ Error al verificar nueva hash:', err);
          process.exit(1);
        }

        console.log('Verificación de nueva hash:', newResult);
        process.exit(0);
      });
    });
  }
});
