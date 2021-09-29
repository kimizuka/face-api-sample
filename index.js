(async () => {
  const modelpath = './weights';
  const face = await Promise.all([
    faceapi.loadTinyFaceDetectorModel(modelpath),
    faceapi.loadFaceLandmarkModel(modelpath),
    faceapi.loadFaceLandmarkTinyModel(modelpath),
    faceapi.loadFaceRecognitionModel(modelpath),
    faceapi.loadFaceExpressionModel(modelpath)
  ]);
  const options = new faceapi.TinyFaceDetectorOptions();
  const stream = await navigator.mediaDevices.getUserMedia({ video: {
    facingMode: 'user'
  }});
  const video = document.querySelector('video');

  video.srcObject = stream;

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  render();

  function render() {
    faceapi.detectSingleFace(
      video,
      options
    ).withFaceLandmarks()
     .withFaceDescriptor()
     .withFaceExpressions()
     .then((result) => {
       console.log(result);

       const dims = faceapi.matchDimensions(
         canvas,
         video,
         true
       );

       const resized = faceapi.resizeResults(
         result,
         dims
       );

       faceapi.draw.drawDetections(
         canvas,
         resized
       );

       faceapi.draw.drawFaceExpressions(
         canvas,
         resized
       );

       faceapi.draw.drawFaceLandmarks(
         canvas,
         resized
       );
     });

    requestAnimationFrame(render);
  }
})();