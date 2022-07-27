let video = document.getElementById("video");
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models"),
  faceapi.nets.faceExpressionNet.loadFromUri("models"),
]).then(beginVideo);

async function beginVideo() {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    video.srcObject = stream;
  } catch (err) {
    console.log(err);
    alert("Unable to connect device");
  }
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const dim = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, dim);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, dim);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas,resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
    
  }, 100);
});
