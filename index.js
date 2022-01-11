(async () => {
  const modelpath = './weights';
  const options = new faceapi.TinyFaceDetectorOptions();
  const stream = await navigator.mediaDevices.getUserMedia({ video: {
    facingMode: 'user'
  }});
  const video = document.querySelector('video');
  const canvas = document.querySelector('canvas');

  await Promise.all([
    faceapi.loadSsdMobilenetv1Model(modelpath),
    faceapi.loadTinyFaceDetectorModel(modelpath),
    faceapi.loadMtcnnModel(modelpath),
    faceapi.loadFaceLandmarkModel(modelpath),
    faceapi.loadFaceLandmarkTinyModel(modelpath),
    faceapi.loadFaceRecognitionModel(modelpath),
    faceapi.loadFaceExpressionModel(modelpath)
  ]);

  video.srcObject = stream;

  render();

  function render() {
    faceapi.detectSingleFace(
      video,
      options
    )
    .withFaceLandmarks()
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
     }).catch((err) => {});

    requestAnimationFrame(render);
  }
})();