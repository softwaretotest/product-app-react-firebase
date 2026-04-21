export const compressImage = async (file, maxSizeKB = 200) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 🔥 ลดขนาด (max width 800px)
      const maxWidth = 800;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;
      let base64;

      // 🔁 loop ลด quality จนขนาดเล็กพอ
      do {
        base64 = canvas.toDataURL("image/jpeg", quality);
        quality -= 0.05;
      } while (base64.length / 1024 > maxSizeKB && quality > 0.3);

      resolve(base64);
    };

    reader.readAsDataURL(file);
  });
};
