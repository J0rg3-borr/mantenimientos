function doGet() {
  return HtmlService.createHtmlOutputFromFile('Registro');
}

function guardarDatos(data) {
  const ssId = "1lOG_SGOBTlNpg9V3SuP8x_qg-U7OMjd8IJ6rUyDcGqg";
  const hojaNombre = "Registro";
  const folderId = "1ENS7Q_Z9hgn08Vtyeyf5v9fE7-UHOJx-"; // ID de la carpeta de Google Drive

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const hoja = ss.getSheetByName(hojaNombre);
    if (!hoja) {
      throw new Error(`La hoja de cálculo con nombre '${hojaNombre}' no fue encontrada.`);
    }

    const tipoEquipoStr = obtenerTipos(data.tipo_equipo || {});
    const estadoFisicoStr = Array.isArray(data.estado_fisico) ? data.estado_fisico.join(", ") : (data.estado_fisico || "");
    const tecladoStr = Array.isArray(data.monitor.teclado) ? data.monitor.teclado.join(", ") : (data.monitor.teclado || "");
    const mouseStr = Array.isArray(data.monitor.mouse) ? data.monitor.mouse.join(", ") : (data.monitor.mouse || "");
    
    const reparacion = data.estado_final.reparacion === 'Sí' ? 'Sí' : 'No';
    const baja = data.estado_final.baja === 'Sí' ? 'Sí' : 'No';
    const operativo = data.estado_final.operativo === 'Sí' ? 'Sí' : 'No';

    const datosFila = [
      data.fecha,
      data.cliente,
      data.tecnico,
      tipoEquipoStr,
      data.marca,
      data.cpu,
      data.modelo,
      data.activo,
      data.serial,
      estadoFisicoStr,
      data.disco.tipo_disco,
      data.disco.capacidad,
      data.disco.tipo,
      data.disco.activo,
      data.disco.marca,
      data.disco.serial,
      data.ram1.tipo_ram,
      data.ram1.capacidad,
      data.ram1.tipo_equipo,
      data.ram1.activo,
      data.ram1.marca,
      data.ram1.serial,
      data.ram2.tipo_ram,
      data.ram2.capacidad,
      data.ram2.tipo_equipo,
      data.ram2.activo,
      data.ram2.marca,
      data.ram2.serial,
      data.tarjeta_pci.capacidad,
      data.tarjeta_pci.marca,
      data.tarjeta_pci.serial,
      data.monitor.conexion,
      data.monitor.pulgadas,
      data.monitor.activo,
      data.monitor.marca,
      data.monitor.modelo,
      data.monitor.serial,
      tecladoStr,
      mouseStr,
      data.diagnostico.board,
      data.diagnostico.flex,
      data.diagnostico.ram,
      data.diagnostico.disco,
      data.diagnostico.tarjeta_red,
      data.diagnostico.bisagras,
      data.diagnostico.teclado,
      data.diagnostico.pantalla,
      data.diagnostico.camara,
      data.diagnostico.microfono,
      data.diagnostico.jack_audio,
      data.diagnostico.carcasa,
      data.diagnostico.puertos_usb,
      data.diagnostico.puerto_red,
      data.diagnostico.puerto_video,
      reparacion,
      baja,
      operativo,
      data.observaciones,
      data.aprobado_por || ""
    ];

    hoja.appendRow(datosFila);
    const fila = hoja.getLastRow();
    
    if (data.firma_digital && data.firma_digital.startsWith("data:image")) {
      const columnaFirma = datosFila.length + 1; // Columna después de aprobado_por

      try {
        const base64Data = data.firma_digital.split(",")[1];
        const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), "image/png", "firma.png");

        // Inserta la imagen flotante primero
        const img = hoja.insertImage(blob, columnaFirma, fila);

        // Ajusta el tamaño de la celda y de la imagen
        hoja.setRowHeight(fila, 50);
        hoja.setColumnWidth(columnaFirma, 100);
        img.setWidth(90);
        img.setHeight(50);

        // Ancla la imagen a la celda correcta (opcional, pero mejora la estabilidad)
        const celda = hoja.getRange(fila, columnaFirma);
        img.setAnchorCell(celda);

      } catch (error) {
        Logger.log("Error al insertar la firma digital: " + error.message);
      }
    }

    // **NUEVO CÓDIGO: Generar y guardar el PDF**
    try {
      const htmlTemplate = HtmlService.createTemplateFromFile('Registro');
      htmlTemplate.data = data; 
      const htmlOutput = htmlTemplate.evaluate().getContent();
      const pdfBlob = Utilities.newBlob(htmlOutput, MimeType.PDF);
      pdfBlob.setName(`Formulario_${data.cliente}_${data.fecha}.pdf`);
      
      const folder = DriveApp.getFolderById(folderId);
      folder.createFile(pdfBlob);
    } catch (error) {
      Logger.log("Error al generar o guardar el PDF: " + error.message);
    }
    
    return { success: true };

  } catch (e) {
    Logger.log("Error en guardarDatos: " + e.message);
    return { success: false, error: e.message };
  }
}

function obtenerTipos(tipos) {
  const arr = [];
  if (tipos) {
    if (tipos.pt) arr.push('PT');
    if (tipos.pc) arr.push('PC');
    if (tipos.aio) arr.push('AIO');
  }
  return arr.join(', ');
}