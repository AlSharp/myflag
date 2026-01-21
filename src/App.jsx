import { useState, useRef, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import classNames from 'classnames';

function App() {

  const FNL_LOGO_URL = window.location.origin + '/fnl_logo.png';
  const LOGO_COLORS = [
    { name: 'black', code: '#000000' },
    { name: 'white', code: '#ffffff' },
    { name: 'red', code: '#d62828' },
  ];
  const SIZE = 512;
  const FLAG_HEIGHT = 110;
  const FLAG_WIDTH = 220;
  const REPUBLICS = [
    { name: 'Ойрат-Калмыкия', image: 'oirat-kalmykia.png' },
    { name: 'Ойрат-Калмыкия 1992', image: 'oirat-kalmykia-1992.png' },
    { name: 'Башкортостан', image: 'bashkortostan.png' },
    { name: 'Татарстан', image: 'tatarstan.jpg' },
    { name: 'Бурятия', image: 'buryatia.png' },
    { name: 'Бурят-Монголия', image: 'buryat-mongolia.png' },
    { name: 'Эрзян Мастор', image: 'erzya.png' },
    { name: 'Мокшень Мастор', image: 'moksha.png' },
    { name: 'Саха', image: 'sakha.png' },
    { name: 'Саха 1992', image: 'sakha-1992.png' },
    { name: 'Ингрия', image: 'ingria.png' },
    { name: 'Балтийская', image: 'baltia.jpeg' },
    { name: 'Черкессия', image: 'circassia.png' },
    { name: 'Ичкерия', image: 'ichkeria.png' },
    { name: 'Тыва', image: 'tyva.svg' },
    { name: 'Алтай', image: 'altai.png' },
  ]

  const editorRef = useRef(null);
  const canvasRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const flagOverlayRef = useRef(null);
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [flag, setFlag] = useState('');
  const [flagImage, setFlagImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoColor, setLogoColor] = useState(LOGO_COLORS[0]);

  useEffect(() => {
    drawLogo();
    if (editorRef.current) {
      canvasRef.current = editorRef.current.canvas.current;
    }
  }, []);

  useEffect(() => {
    if (!logo) return;
    recolorLogo();
  }, [logo, logoColor])

  useEffect(() => {
    if (flag === '') {
      setFlagImage(null);
    } else {
      const flagImage = new Image();
      flagImage.src = window.location.origin + '/' + flag;
      flagImage.onload = () => setFlagImage(flagImage);
    }
  }, [flag])

  useEffect(() => {
    if (flagImage) {
      const canvas = flagOverlayRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        flagImage,
        canvas.width / 2 - FLAG_WIDTH / 2,
        canvas.height - FLAG_HEIGHT - 60,
        FLAG_WIDTH,
        FLAG_HEIGHT);
    } else {
      const canvas = flagOverlayRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [flagImage])

  const onScaleChange = (event) => {
    const scale = parseFloat(event.target.value);
    setScale(scale);
  }

  const onFlagChange = (event) => {
    setFlag(event.target.value);
  }

  const drawLogo = () => {
    const logo = new Image();
    logo.src = FNL_LOGO_URL;
    logo.onload = () => {
      const canvas = logoOverlayRef.current;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(logo, 20, 150, logo.width, logo.height);
      setLogo(logo);
    };
  }

  const recolorLogo = () => {
    const canvas = logoOverlayRef.current;
    const ctx = canvas.getContext('2d');

    ctx.save();

    ctx.drawImage(logo, 20, 150, logo.width, logo.height);

    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = logoColor.code;
    ctx.fillRect(20, 150, logo.width, logo.height);

    ctx.restore();
  }

  const clearImage = () => {
    setImage(null);
    setScale(1);
    setFlagImage(null);
    setFlag('');
    setLogoColor(LOGO_COLORS[0]);
  }

  const downloadAvatar = () => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = SIZE;
    exportCanvas.height = SIZE;

    const ctx = exportCanvas.getContext('2d');
    ctx.drawImage(editorRef.current.getImageScaledToCanvas(), 0, 0);
    ctx.drawImage(logoOverlayRef.current, 0, 0);
    ctx.drawImage(flagOverlayRef.current, 0, 0);

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
            style={{ width: 250, height: 250 }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="relative bg-white" {...getRootProps()}>
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={SIZE}
                  height={SIZE}
                  borderRadius={256}
                  scale={scale}
                  style={{ width: 250, height: 250 }}
                />
                <canvas
                  ref={logoOverlayRef}
                  className="absolute inset-0 pointer-events-none"
                  width={SIZE}
                  height={SIZE}
                  style={{ width: 250, height: 250 }}
                />
                <canvas
                  ref={flagOverlayRef}
                  className="absolute inset-0 pointer-events-none"
                  width={SIZE}
                  height={SIZE}
                  style={{ width: 250, height: 250 }}
                />
                <input {...getInputProps()} />
              </div>
            )}
          </Dropzone>
        </div>
        <div className="flex flex-col items-center mt-8">
          <div className="flex gap-2 mb-8">
            {
              LOGO_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setLogoColor(color)}
                  className={classNames('w-8 h-8 rounded-full border', {
                    'ring-2 ring-gray-500': logoColor.name === color.name,
                    'border-gray-300': logoColor.name !== color.name
                  })}
                  style={{ backgroundColor: LOGO_COLORS.find(c => c.name === color.name).code }}
                  aria-label={`Logo color ${color.name}`}
                />
              ))
            }
          </div>
          <div className="mb-6 w-64">
            <input
              className="w-full"
              name="scale"
              type="range"
              min="0.1"
              max="2"
              step="0.01"
              value={scale}
              onChange={onScaleChange} />
          </div>
          <div className="mb-4 w-64">
            <label htmlFor="flag">Добавьте свой флаг: </label>
            <select name="flag" id="flag" onChange={onFlagChange} value={flag} className="w-full mt-2 bg-transparent border border-gray-300 px-4 py-2 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400">
              <option value="">Выберите республику</option>
              {
                REPUBLICS
                  .sort((a, b) => {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                  })
                  .map(rep => (
                    <option key={rep.name} value={rep.image}>{ rep.name }</option>
                  ))
              }
            </select>
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
