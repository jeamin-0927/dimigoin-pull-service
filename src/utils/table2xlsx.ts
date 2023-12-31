// import { Workbook } from "exceljs";
import * as Excel from "exceljs";
import { saveAs } from "file-saver";

export type PrintData = {
  [key: string | number]: {
    [key: string]: PrintDataArray[]
  }
}

export type PrintDataArray = {
  grade: number | string | number[];
  class: number | string | number[];
  count: number | string | number[];
  number: number;
  name: string;
  gender: "남" | "여";
  breakfast: "O" | "X";
  lunch: "O" | "X";
  dinner: "O" | "X";
  outing: string;
  etc: string;
}

const table2xlsx = async (
  PrintData: PrintData,
  filePath: string
) => {

  const workbook = new Excel.Workbook();
	
  Object.entries(PrintData).map((_, i1) => Object.keys(_[1]).map((showDate, i2) => {
    const worksheet = workbook.addWorksheet(`${_[0]}학년 ${showDate}`);

    const columnsStyle: {
      alignment: {
        horizontal: "center",
        vertical: "middle",
      }
    } = { 
      //text center
      alignment: {
        horizontal: "center",
        vertical: "middle",
      },
    };

    worksheet.mergeCells("A1:K1");

    worksheet.getRow(1).getCell(1).value = `${_[0]}학년 ${showDate}`;

    worksheet.getRow(2).values = [
      "학년", "반", "인원", "학번", "이름", "성별", "조식", "중식", "석식", "외출", "비고"
    ];

    worksheet.columns = [
      { header: "학년", key: "grade", width: 10, style: columnsStyle },
      { header: "반", key: "class", width: 10, style: columnsStyle },
      { header: "인원", key: "count", width: 10, style: columnsStyle },
      { header: "학번", key: "number", width: 10, style: columnsStyle },
      { header: "이름", key: "name", width: 20, style: columnsStyle },
      { header: "성별", key: "gender", width: 10, style: columnsStyle },
      { header: "조식", key: "breakfast", width: 10, style: columnsStyle },
      { header: "중식", key: "lunch", width: 10, style: columnsStyle },
      { header: "석식", key: "dinner", width: 10, style: columnsStyle },
      { header: "외출", key: "outing", width: 50, style: columnsStyle },
      { header: "비고", key: "etc", width: 10, style: columnsStyle },
    ];
    const data = [
      ..._[1][showDate].map((_, i) => {
        const { grade, class: _class, count, ...dt } = _;
        return {
          grade: _.grade ? `${_.grade}학년` : "",
          class: _.class ? `${_.class}반` : "",
          count: _.count ? `${_.count}명` : "",
          ...dt
        };
      })
    ];
    worksheet.addRows(data);

    type CellType = {
      style: "thin",
      color: {argb: "FFED7D32"},
    }

    const cellBorder: {
      top: CellType,
      left: CellType,
      bottom: CellType,
      right: CellType,
    } = {
      top: {
        style: "thin",
        color: {argb: "FFED7D32"},
      },
      left: {
        style: "thin",
        color: {argb: "FFED7D32"},
      },
      bottom: {
        style: "thin",
        color: {argb: "FFED7D32"},
      },
      right: {
        style: "thin",
        color: {argb: "FFED7D32"},
      },
    };
    const cellFill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE6D8" },
    } = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE6D8" },
    };
    const cellFont = {
      bold: true,
      name: "맑은 고딕", 
      size: 12,
    };
    const cellAlignment: {
      horizontal: "center",
      vertical: "middle",
    } = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.addRow({grade: `총원 ( ${data.length}명 )`});

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      row.height = 17;
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        cell.border = cellBorder;
        cell.font = {
          name: "맑은 고딕", 
          size: 12,
        };
      });
    });

    worksheet.getRow(1).height = 25;
    worksheet.getRow(1).getCell(1).value = `${_[0]}학년 ${showDate} 잔류자 외출 및 급식 취소 명단`;
    Array(11).fill(0).map((_, i) => {
      worksheet.getRow(1).getCell(i + 1).fill = cellFill;
      worksheet.getRow(1).getCell(i + 1).font = {
        bold: true,
        name: "맑은 고딕", 
        size: 16,
      };
      worksheet.getRow(1).getCell(i + 1).alignment = cellAlignment;
      worksheet.getRow(2).getCell(i + 1).fill = cellFill;
      worksheet.getRow(2).getCell(i + 1).font = cellFont;
      worksheet.getRow(2).getCell(i + 1).alignment = cellAlignment;
      worksheet.getRow(data.length + 3).getCell(i + 1).fill = cellFill;
      worksheet.getRow(data.length + 3).getCell(i + 1).border = cellBorder;
      worksheet.getRow(data.length + 3).getCell(i + 1).font = cellFont;
    });

    _[1][showDate].map((_, i) => {
      let { grade, class: _class, count, ...dt } = _;
      if(grade[1]) {
        worksheet.mergeCells(`A${i + 3}:A${i + grade[1] + 2}`);
      }
      if(_class[1]) {
        worksheet.mergeCells(`B${i + 3}:B${i + _class[1] + 2}`);
        worksheet.mergeCells(`C${i + 3}:C${i + _class[1] + 2}`);
      }
      return {
        ...dt
      };
    });
    worksheet.mergeCells(`A${data.length + 3}:C${data.length + 3}`);
    worksheet.mergeCells(`D${data.length + 3}:K${data.length + 3}`);
  }));

  const buffer = await workbook.xlsx.writeBuffer();
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const blob = new Blob([buffer], {type: fileType});
  saveAs(blob, filePath);
};

export default table2xlsx;