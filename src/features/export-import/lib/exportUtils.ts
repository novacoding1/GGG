import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ShezhirePerson } from '@/entities/node.types';

export const exportToJSON = (nodes: ShezhirePerson[], filename = 'shezhire-data.json') => {
  const jsonStr = JSON.stringify(nodes, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (nodes: ShezhirePerson[], filename = 'shezhire-data.xlsx') => {
  const exportData = nodes.map((node) => ({
    ID: node.id,
    'Есімі (Имя)': node.name,
    'Сипаттамасы (Описание)': node.description || '',
    'Туған жылы (Год рожд.)': node.birthYear || '',
    'Қайтыс болған жылы (Год смерти)': node.deathYear || '',
    'Жынысы (Пол)': node.gender === 'male' ? 'Ер' : 'Әйел',
    'Жүз (Жуз)': node.zhuz,
    'Род (Ру)': node.clan || '',
    'Атасы ID (Parent ID)': node.parentId || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шежіре');
  XLSX.writeFile(workbook, filename);
};

export const exportToPNG = async (elementId: string, filename = 'shezhire-tree.png') => {
  const element = document.getElementById(elementId) || document.querySelector('.react-flow') as HTMLElement;
  if (!element) return;

  try {
    const dataUrl = await toPng(element, { backgroundColor: '#0F172A', quality: 0.95 });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('PNG Export failed', err);
  }
};

export const exportToSVG = async (elementId: string, filename = 'shezhire-tree.svg') => {
  const element = document.getElementById(elementId) || document.querySelector('.react-flow') as HTMLElement;
  if (!element) return;

  try {
    const dataUrl = await toSvg(element, { backgroundColor: '#0F172A' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('SVG Export failed', err);
  }
};

export const exportToPDF = async (elementId: string, filename = 'shezhire-tree.pdf') => {
  const element = document.getElementById(elementId) || document.querySelector('.react-flow') as HTMLElement;
  if (!element) return;

  try {
    const dataUrl = await toPng(element, { backgroundColor: '#0F172A', quality: 0.95 });
    const pdf = new jsPDF('landscape', 'px', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
    pdf.save(filename);
  } catch (err) {
    console.error('PDF Export failed', err);
  }
};

export const printTree = () => {
  window.print();
};
