import formidable from 'formidable';
import fs from 'fs';
import { promisify } from 'util';

const fsRename = promisify(fs.rename);

export const config = {
  api: {
    bodyParser: false, // formidable이 자체적으로 바디를 파싱하기 때문에 기본 바디 파서를 비활성화합니다.
  },
};

const uploadDir = 'D:/devtools/apache/Apache24/htdocs/uploads'; // 파일이 저장될 디렉터리

const handler = async (req, res) => {
  if (req.method === 'POST') { // POST 요청만 처리
    const form = new formidable.IncomingForm({
      uploadDir, // 업로드된 파일이 저장될 디렉터리
      keepExtensions: true, // 파일 확장자를 유지
      filename: (name, ext, part, form) => {
        return `${Date.now()}_${part.originalFilename}`; // 파일명을 현재 시간과 원래 파일명으로 구성
      },
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the files' }); // 파일 파싱 중 에러 발생 시 처리
        return;
      }

      const oldPath = files.file.filepath;
      const newPath = `${uploadDir}/${files.file.newFilename}`;
      await fsRename(oldPath, newPath); // 파일을 새로운 경로로 이동

      const fileUrl = `${req.headers.origin}/uploads/${files.file.newFilename}`;
      res.status(200).json({ filePath: fileUrl }); // 파일 경로를 응답으로 반환
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // GET, PUT 등 다른 메서드는 허용하지 않음
  }
};

export default handler;
