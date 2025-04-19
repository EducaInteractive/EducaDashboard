"use client"
import jsPDF from 'jspdf';
import {  File } from 'lucide-react';
import notyf from '@/utils/notificacion';

const CourseInfoPDFDownloader = ({ localDataCourse,schema,generateSchema,isSaving }) => {

  const loadImageAsBase64 = async (imageUrl) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const generatePDF =async () => {
    const esquema = schema;
  
    if (!esquema.trim()) {
      notyf.error('No hay contenido para generar el PDF');
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    
  
    const primaryColor = '#1A5F7A';
  
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Educa Interactive", margin, 20, { align: 'left' });
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Información del Curso`, margin, 50);
    doc.setLineWidth(0.5);
    doc.line(margin, 55, pageWidth - margin, 55);
  
    const courseDetails = [
      `Título: ${localDataCourse.tema}`,
      `Contenidos Particulares: ${localDataCourse.knowledge}`,
      `Público Objetivo: ${localDataCourse.people}`
    ];
  
    courseDetails.forEach((detail, index) => {
      const splitText = doc.splitTextToSize(detail, pageWidth - 2 * margin);
      doc.text(splitText, margin, 65 + (index * 20));
    });
  
    doc.setFontSize(12);
    doc.text(`Esquema del Curso`, margin, 140);
    doc.setLineWidth(0.5);
    doc.line(margin, 145, pageWidth - margin, 145);

    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(esquema, pageWidth - 2 * margin);
    doc.text(splitText, margin, 155);
  
    doc.setTextColor(100);
    doc.setFontSize(8);
    doc.text('©2024 Educa Interative', margin, pageHeight - 1);
  
    doc.save('Curso_Marketing_Digital.pdf');
  };

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={generatePDF}
        className="bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg shadow-sm text-white font-medium flex items-center justify-center gap-2"
        disabled={generateSchema||isSaving}
      >
        <File className="w-5 h-5" size={20} />
        Descargar PDF
      </button>
    </div>
  );
};

export default CourseInfoPDFDownloader;