function downloadCanvas(name, content) {
	const a = document.createElement("a");
	a.href = content;
	a.download = name;
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(a.href);
}

function chunkBits(uint8Array, channelBits) {
  const result = [];
  const totalBits = uint8Array.byteLength * 8;
  let bitPos = 0;
  let channelIndex = 0;

  while (bitPos < totalBits) {
    const width = channelBits[channelIndex % channelBits.length];
    let value = 0;

    for (let i = 0; i < width; i++) {
      value <<= 1;

      if (bitPos < totalBits) {
        const byteIndex = Math.floor(bitPos / 8);
        const bitOffset = 7 - (bitPos % 8);
        value |= (uint8Array[byteIndex] >> bitOffset) & 1;
      }

      bitPos++;
    }

    result.push(value);
    channelIndex++;
  }

  return result;
}

function bitsToImage(uint8Array, channelBits, maxWidth, canvas) {
  	const bitsPerPixel = channelBits.reduce((a, b) => a + b, 0);
  	const totalBits = uint8Array.byteLength * 8;
  	const totalPixels = Math.floor(totalBits / bitsPerPixel);

//   const width = Math.ceil(Math.min(Math.ceil(Math.sqrt(totalPixels)), maxWidth) / 2) * 2;
	const width = maxWidth;
  	const height = Math.ceil(Math.ceil(totalPixels / width) / 2) * 2;

  	canvas.width = width;
  	canvas.height = height;

  	const ctx = canvas.getContext('2d');
  	const imageData = ctx.createImageData(width, height);
  	const pixels = imageData.data;

  	const channels = chunkBits(uint8Array, channelBits);

  	for (let i = 0; i < width * height; i++) {
    	const r = channels[i * 3 + 0] ?? 0;
    	const g = channels[i * 3 + 1] ?? 0;
    	const b = channels[i * 3 + 2] ?? 0;

    	const pixelIndex = i * 4;
    	pixels[pixelIndex + 0] = Math.floor(r * (2 ** (8 - channelBits[0])));
    	pixels[pixelIndex + 1] = Math.floor(g * (2 ** (8 - channelBits[1])));
    	pixels[pixelIndex + 2] = Math.floor(b * (2 ** (8 - channelBits[2])));
    	pixels[pixelIndex + 3] = 255;
  	}

  	ctx.putImageData(imageData, 0, 0);
}