import sharp from 'sharp'

sharp('src/assets/logo.webp')
  .toFormat('avif')
  .toFile('src/assets/logo.avif', (err, info) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('File converted:', info);
    }
  });
