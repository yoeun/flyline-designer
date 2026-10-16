function download(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
}

function serialize(svg) {
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return new XMLSerializer().serializeToString(clone);
}

export function exportSvg(svg, filename) {
  const url = URL.createObjectURL(new Blob([serialize(svg)], { type: 'image/svg+xml' }));
  download(url, `${filename}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportPng(svg, filename, scale = 2) {
  const { width, height } = svg.viewBox.baseVal;
  const url = URL.createObjectURL(new Blob([serialize(svg)], { type: 'image/svg+xml' }));
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      const pngUrl = URL.createObjectURL(blob);
      download(pngUrl, `${filename}.png`);
      setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
    }, 'image/png');
  };
  img.src = url;
}
