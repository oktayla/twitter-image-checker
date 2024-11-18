(async function() {
  let rekognition;

  function blurImage(img) {
    img.style.filter = 'blur(100px)';
  }

  function removeBlur(img) {
    img.style.filter = 'inherit';
  }

  function initializeAWS() {
    AWS.config.update({
      region: CONFIG.AWS_REGION,
      credentials: new AWS.Credentials({
        accessKeyId: CONFIG.AWS_ACCESS_KEY_ID,
        secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY
      })
    });
    rekognition = new AWS.Rekognition();
  }

  async function compareFaces(sourceImage, targetImage) {
    initializeAWS();

    const sourceBuffer = base64ToArrayBuffer(sourceImage);
    const targetBuffer = base64ToArrayBuffer(targetImage);

    const params = {
      SourceImage: {
        Bytes: new Uint8Array(sourceBuffer)
      },
      TargetImage: {
        Bytes: new Uint8Array(targetBuffer)
      },
      SimilarityThreshold: 90
    };

    try {
      const response = await rekognition.compareFaces(params).promise();
      console.log(response);
      return response.FaceMatches.length > 0;
    } catch (error) {
      console.error('Error comparing faces:', error);
      return false;
    }
  }

  function getBase64FromImage(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
  }

  async function getBase64FromUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  function base64ToArrayBuffer(base64) {
    const base64String = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const binaryString = window.atob(base64String);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  let sourceImage = await getBase64FromUrl(CONFIG.IMAGE_URL);

  async function processTwitterImages() {
    const twitterImages = document.querySelectorAll('img[src*="pbs.twimg.com/media"]');

    for (const img of twitterImages) {
      if (img.dataset.processed) continue
      img.dataset.processed = 'true';

      blurImage(img.parentElement);

      const targetImage = await getBase64FromUrl(img.src);

      compareFaces(sourceImage, targetImage)
        .then(function (matched) {
          console.log(matched);
          if (!matched) {
            removeBlur(img.parentElement);
          }
        })
        .catch(function () {
          removeBlur(img.parentElement);
        })
    }
  }

  const observer = new MutationObserver(processTwitterImages);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  processTwitterImages();
})()
