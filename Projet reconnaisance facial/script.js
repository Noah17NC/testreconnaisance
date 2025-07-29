async function startFaceDetection() {
    try {
      // 1. Charger les modèles (chemin relatif depuis la racine du serveur)
      await faceapi.nets.tinyFaceDetector.loadFromUri('models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('models');
  
      // 2. Accéder à la webcam
      const video = document.getElementById('video');
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;
  
      // 3. Détection en temps réel
      video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);
  
        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(
            video, 
            new faceapi.TinyFaceDetectorOptions()
          ).withFaceLandmarks().withFaceDescriptors();
          
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Effacer et redessiner
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }, 100);
      });
  
    } catch (err) {
      console.error("Erreur lors du démarrage:", err);
      alert("Une erreur est survenue. Voir la console pour plus de détails.");
    }
  }
  
  // Démarrer quand tout est prêt
  if (window.faceapi) {
    startFaceDetection();
  } else {
    window.addEventListener('face-api.js-loaded', startFaceDetection);
  }