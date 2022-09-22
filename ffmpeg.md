## Setup Script

Installation might not work, add the `<script>` tag in `<head>` instead:
```html
    <script
      src="https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.5/dist/ffmpeg.min.js"
      async
    ></script>
```

## Setup Proxy
Somehow it works with JS file, not TS in `src/setupProxy.js`:

```js
// ========================================================
// use proper headers for SharedArrayBuffer on Firefox
// see https://github.com/ffmpegwasm/ffmpeg.wasm/issues/102
// ========================================================
module.exports = function (app) {
  app.use('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
};
```
## Setup script

```typescript
const { createFFmpeg, fetchFile } = window.FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
});

export default function YourComponent(): React.Component {
  const [done, setDone] = useState(false);
  const [compressedVideo, setVideo] = useState();
  const [thumbnail, setThumbnail] = useState();
  
  useEffect(() => {
    ffmpeg.load().then(() => setDone(true));
  }, []);

  async function handleChange(evt: React.HTMLInputElement) {
    if (!done) return;
    const file = evt.currentTarget.files[0];

    const t0 = performance.now();
    {
      ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(file));
      await ffmpeg.run(
        '-i',
        'test.mp4',
        '-vf',
        `scale='min(640,iw)':'min(-1,ih)',crop='iw-mod(iw,2)':'ih-mod(ih,2)'`,
        '-r',
        '5',
        '-c:v',
        'libx264',
        '-tune',
        'fastdecode',
        '-preset',
        'ultrafast',
        'out.mp4'
      );
      const output = ffmpeg.FS('readFile', 'out.mp4');
      const video = URL.createObjectURL(
        new Blob([output.buffer], {
          type: 'video/mp4',
        })
      );
      setVideo(video);
    }

    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-vf',
      'thumbnail',
      '-frames:v',
      '1',
      'out.png'
    );
    const output = ffmpeg.FS('readFile', 'out.png');
    const image = URL.createObjectURL(
      new Blob([output.buffer], { type: 'image/png' })
    );
    setThumbnail(image);
    const t1 = performance.now();
    window.alert(`took ${t1 - t0}ms`);
  }

  return (</>)
 }
```
