import { useState, useRef, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';

function App() {

  const FNL_LOGO_URL = window.location.origin + '/fnl_logo.png';
  const SIZE = 1024;

  const editorRef = useRef(null);
  const canvasRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const logo = new Image();
    logo.src = FNL_LOGO_URL;
    setLogo(logo);
    if (editorRef.current) {
      canvasRef.current = editorRef.current.canvas.current;
    }
  }, []);

  useEffect(() => {
    if (logo) {
      drawLogo(logo);
    }
  }, [logo])

  const handleScale = (event) => {
    const scale = parseFloat(event.target.value);
    setScale(scale);
  }

  const drawLogo = (logo) => {
    const canvas = logoOverlayRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(logo, 30, 300, 120 * 2, 225 * 2);
  }

  const clearImage = () => {
    setImage(null);
    setScale(1);
  }

  const downloadAvatar = () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = SIZE;
    exportCanvas.height = SIZE;

    const ctx = exportCanvas.getContext('2d');
    ctx.drawImage(editorRef.current.getImageScaledToCanvas(), 0, 0);
    ctx.drawImage(logoOverlayRef.current, 0, 0);

    exportCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'my_avatar.png';
      a.click();

      URL.revokeObjectURL(url);
    })
  }

  return (
    <>
      <header id="header" className="flex bg-[#a5a56c] px-8 py-6">
        <div>
					<a href="https://freenationsleague.org/">
            <img width="114" height="48" src="https://freenationsleague.org/wp-content/uploads/2024/05/logo_fnl_ru-2.svg" className="" alt="logo" />
          </a>
        </div>
      </header>
      <main id="main" className="px-4 py-8 min-h-full">
        <h1 className="text-4xl font-bold">
          Создайте изображение профиля с флагом вашей республики.
        </h1>
        <div className="flex justify-center items-center mt-8">
          <Dropzone
            onDrop={(files) => setImage(files[0])}
            noClick={!!image}
            style={{ width: '250px', height: '250px' }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="relative bg-white" {...getRootProps()}>
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={SIZE}
                  height={SIZE}
                  borderRadius={512}
                  scale={scale}
                  style={{ width: '250px', height: '250px' }}
                />
                <canvas
                  ref={logoOverlayRef}
                  className="absolute inset-0 pointer-events-none"
                  width={SIZE}
                  height={SIZE}
                  style={{ width: '250px', height: '250px' }}
                />
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        </div>
        <div className="flex flex-col items-center mt-8">
          <div className="mb-4 w-64">
            <input
              className="w-full"
              name="scale"
              type="range"
              min="0.1"
              max="2"
              step="0.01"
              value={scale}
              onChange={handleScale} />
          </div>
          <div className="mb-4">
            <button className="w-64 py-2 bg-[#a5a56c] text-white hover:cursor-pointer font-bold" onClick={downloadAvatar}>
              Сохранить
            </button>
          </div>
          <div className="mb-4">
            <button className="w-64 py-2 bg-[#a5a56c] text-white hover:cursor-pointer font-bold" onClick={clearImage}>
              Очистить
            </button>
          </div>
        </div>
      </main>
      <footer id="footer" className="flex justify-center items-center">
        <div className="text-center">
          <p>© 2024 Лига Свободных Народов.</p>
          <p>Все права защищены.</p>
        </div>
      </footer>
    </>
  )
}

export default App
