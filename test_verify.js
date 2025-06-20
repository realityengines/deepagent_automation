const { verifyImage, verifyPDF, verifyPowerPoint } = require('./helpers/verifyDocuments.js');

// Test functions for each file type
async function testVerifyImage() {
  try {
    console.log('Testing Image Verification...');
    const result = await verifyImage(
      "A illustration of a woman alongside the beach",
      "./5bd6560b-b4fb-454d-aca5-4fb3ca0eaecb.png"
    );
    console.log('Image Result:', result);
    console.log('✅ Image verification completed successfully!\n');
  } catch (error) {
    console.error('❌ Error during image verification:', error.message);
  }
}

async function testVerifyPDF() {
  try {
    console.log('Testing PDF Verification...');
    const result = await verifyPDF(
      "A pdf explaining thermodynamics",
      "./whiskers_book_combined.pdf"
    );
    console.log('PDF Result:', result);
    console.log('✅ PDF verification completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Error during PDF verification:', error.message);
  }
}

async function testVerifyPowerPoint() {
  try {
    console.log('Testing PowerPoint Verification...');
    const result = await verifyPowerPoint(
      "A powerpoint presentation on climate change",
      "./ICICI_Bank_Stock_Performance_Analysis.pptx"
    );
    console.log('PowerPoint Result:', result);
    console.log('✅ PowerPoint verification completed successfully!\n');
  } catch (error) {
    console.error('❌ Error during PowerPoint verification:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Document Verification Tests ===\n');
  
  await testVerifyImage();
  await testVerifyPDF();
  await testVerifyPowerPoint();
  
  console.log('=== Tests Completed ===');
}

// Only run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { 
  testVerifyImage, 
  testVerifyPDF, 
  testVerifyPowerPoint,
  runAllTests 
};