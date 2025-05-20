const http = require("http");
const fs = require("fs"); // ملاحظة: fs مش مستخدمة في الكود الحالي، ممكن نحذفها لو مش لازمة

const server = http.createServer((req, res) => {
  // إعداد رأس Content-Type
  res.setHeader("Content-Type", "text/html");

  // دعم CORS (اختياري، يمكن إزالته لو مش لازم)
  res.setHeader("Access-Control-Allow-Origin", "*");

  // التعامل مع طلبات OPTIONS لـ CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(204);
    res.end();
    return;
  }

  // تقسيم المسار
  const para = req.url;
  console.log("Request URL:", para);
  const newOpeartion = para.split("/");
  console.log("Path parts:", newOpeartion);

  // التحقق من صحة المدخلات
  if (
    newOpeartion.length < 4 ||
    isNaN(Number(newOpeartion[2])) ||
    isNaN(Number(newOpeartion[3]))
  ) {
    res.writeHead(400);
    res.write("<h1>Bad Request: Invalid parameters</h1>");
    res.end();
    return;
  }

  // تحديد العملية والنتيجة
  let operation, result;
  if (newOpeartion[1] === "add" || newOpeartion[1] === "+") {
    operation = "Addition";
    result = Number(newOpeartion[2]) + Number(newOpeartion[3]);
    console.log(`Result: ${result}`);
  } else if (newOpeartion[1] === "mult" || newOpeartion[1] === "*") {
    operation = "Multiplication";
    result = Number(newOpeartion[2]) * Number(newOpeartion[3]);
    console.log(`Result: ${result}`);
  } else if (newOpeartion[1] === "devied" || newOpeartion[1] === "/") {
    operation = "Multiplication";
    result = Number(newOpeartion[2]) / Number(newOpeartion[3]);
    console.log(`Result: ${result}`);
  } else {
    res.writeHead(404);
    res.write("<h1>404 - Not Found</h1>");
    res.end();
    return;
  }

  const logMessage = `${operation}: ${newOpeartion[2]} ${
    newOpeartion[1] === "add" || newOpeartion[1] === "+" ? "+" : "*"
  } ${newOpeartion[3]} = ${result}\n`;
  fs.appendFile("file.txt", logMessage, (err) => {
    if (err) {
      console.error("Error writing to file:", err.message);
    } else {
      console.log("Result written to results.txt");
    }
  });

  // إنشاء استجابة HTML مشتركة
  res.writeHead(200);
  res.write(`
    <h2>The operation is: ${operation}</h2>
    <h3>The first param is: ${newOpeartion[2]}</h3>
    <h3>The second param is: ${newOpeartion[3]}</h3>
    <h1>The result is: ${result}</h1>
  `);
  res.end();
});

// تشغيل الخادم
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// التعامل مع أخطاء الخادم
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("Server error:", err.message);
  }
});
