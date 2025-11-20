const fs = require('fs');
const path = require('path');

// Liste des fichiers prioritaires à corriger (ceux qui causent les erreurs actuelles)
const filesToFix = [
  'src/components/TrainingTeaser.js',
  'src/components/FeaturedPartners.js', 
  'src/App.js',
  'src/components/HRManagement.js',
  'src/hooks/usePageTracking.js',
  'src/pages/AdminDashboard.js',
  'src/pages/Home.js'
];

console.log('🚀 Début de la correction automatique...');

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Remplacements
    content = content.replace(
      /http:\/\/localhost:5000\/api/g, 
      '`${process.env.REACT_APP_API_URL}/api`'
    );
    
    content = content.replace(
      /"http:\/\/localhost:5000\/api/g, 
      '"`${process.env.REACT_APP_API_URL}/api`'
    );
    
    content = content.replace(
      /'http:\/\/localhost:5000\/api/g, 
      '\'`${process.env.REACT_APP_API_URL}/api`'
    );
    
    // Pour les URLs avec chemin (comme les images)
    content = content.replace(
      /http:\/\/localhost:5000(?!\/api)/g, 
      '`${process.env.REACT_APP_API_URL}`'
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
    } else {
      console.log(`➖ No changes: ${file}`);
    }
  } else {
    console.log(`❌ File not found: ${file}`);
  }
});

console.log('🎉 Correction automatique terminée !');