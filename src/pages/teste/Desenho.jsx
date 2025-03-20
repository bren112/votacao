import { useEffect, useRef, useState } from "react";

export default function AutoDrawingCanvas() {
  const canvasRef = useRef(null);
  const [drawingComplete, setDrawingComplete] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    
    const elements = [
      // Sol
      { type: "circle", x: 50, y: 50, radius: 30, color: "#FFD700" },
      { type: "line", x1: 50, y1: 10, x2: 50, y2: 30, color: "#FFD700" },
      { type: "line", x1: 50, y1: 70, x2: 50, y2: 90, color: "#FFD700" },
      { type: "line", x1: 10, y1: 50, x2: 30, y2: 50, color: "#FFD700" },
      { type: "line", x1: 70, y1: 50, x2: 90, y2: 50, color: "#FFD700" },
      
      // Grama
      { type: "rectangle", x: 0, y: 220, width: 300, height: 80, color: "#32CD32" },
      
      // Boneco
      { type: "circle", x: 150, y: 100, radius: 30, color: "#000" }, // Cabeça
      { type: "line", x1: 150, y1: 130, x2: 150, y2: 200, color: "#000" }, // Corpo
      { type: "line", x1: 150, y1: 150, x2: 120, y2: 180, color: "#000" }, // Braço esquerdo
      { type: "line", x1: 150, y1: 150, x2: 180, y2: 180, color: "#000" }, // Braço direito
      { type: "line", x1: 150, y1: 200, x2: 130, y2: 250, color: "#000" }, // Perna esquerda
      { type: "line", x1: 150, y1: 200, x2: 170, y2: 250, color: "#000" }, // Perna direita
      
      // Roupas
      { type: "rectangle", x: 135, y: 130, width: 30, height: 50, color: "#FF0000" }, // Camisa
      { type: "rectangle", x: 125, y: 250, width: 10, height: 10, color: "#0000FF" }, // Pé esquerdo
      { type: "rectangle", x: 165, y: 250, width: 10, height: 10, color: "#0000FF" }, // Pé direito
    ];
    
    let index = 0;
    function drawStep() {
      if (index < elements.length) {
        const elem = elements[index];
        if (elem.type === "line") {
          ctx.strokeStyle = elem.color;
          ctx.beginPath();
          ctx.moveTo(elem.x1, elem.y1);
          ctx.lineTo(elem.x2, elem.y2);
          ctx.stroke();
        } else if (elem.type === "circle") {
          ctx.fillStyle = elem.color;
          ctx.beginPath();
          ctx.arc(elem.x, elem.y, elem.radius, 0, Math.PI * 2);
          ctx.fill();
        } else if (elem.type === "rectangle") {
          ctx.fillStyle = elem.color;
          ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
        }
        index++;
        setTimeout(drawStep, 400);
      } else {
        setDrawingComplete(true);
      }
    }
    
    drawStep();
  }, []);
  
  return (
    <div className="flex flex-col items-center mt-10">
      <canvas ref={canvasRef} width={300} height={300} className="border border-gray-500 bg-white" />
      {drawingComplete && <p className="mt-4 text-lg font-bold text-green-600">Desenho Concluído! 🎨</p>}
    </div>
  );
}
