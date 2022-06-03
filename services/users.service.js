const path = require('path');
const pdfmake = require('pdfmake');
const { models: { User } } = require('../helpers/db.helper');
const { filesAsJson } = require('../utils/file-upload.utils');
const { sendMail } = require('../utils/email.utils');

const getPath = dir => path.join(__dirname, dir);

const find = async () => {
  const users = await User.find({}, { ine: 0, curp: 0, photo: 0, addressProof: 0 });
  return users;
};

const findFile = async (id, file) => {
  const user = await User.findById(id);
  return user[file];
};

const insert = async (user, files) => {
  const jsonFiles = filesAsJson(files);
  return await User.create({ ...user, ...jsonFiles });
};

const generatePdf = async (id) => {
  const user = await User.findById(id, { ine: 0, curp: 0, addressProof: 0 });
  const docDefinition = {
    content: [
      { text: 'Creación de Tarjeta INAPAM', style: 'title' },
      {
        table: {
          body: [
            [
              {
                table: {
                  body: [
                    [
                      {
                        text: 'TARJETA INAPAM',
                        style: 'header'
                      }
                    ]
                  ],
                  widths: ['*'],
                },
                layout: 'header',
              }
            ],
            [
              {
                table: {
                  body: [
                    [
                      {
                        stack: [
                          {
                            text: [
                              { text: 'Nombre: ', bold: true },
                              user.firstName,
                            ],
                            style: 'fields'
                          },
                          {
                            text: [
                              { text: 'Apellido Paterno: ', bold: true },
                              user.lastName.split(' ')[0],
                            ],
                            style: 'fields'
                          },
                          {
                            text: [
                              { text: 'Apellido Materno: ', bold: true },
                              user.lastName.split(' ')[1],
                            ],
                            style: 'fields'
                          },
                          {
                            text: [
                              { text: 'CURP: ', bold: true },
                              user.curpText,
                            ],
                            style: 'fields'
                          }
                        ]
                      },
                      {
                        image: `data:image/png;base64,${user.photo.toString('base64')}`,
                        fit: [100, 100],
                        alignment: 'center',
                        margin: [0, 0, 0, 10]
                      }
                    ]
                  ],
                  widths: ['*', 100],
                },
                layout: 'noBorders',
              }
            ]
          ],
          widths: [300],
        },
        layout: 'noInnerBorder',
        margin: [100, 0, 0, 0]
      }
    ],
    pageSize: 'A4',
  };

  docDefinition.styles = {
    title: {
      fontSize: 20,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 20]
    },
    header: {
      fontSize: 14,
      bold: true,
      alignment: 'center',
      color: '#ffffff'
    },
    fields: {
      fontSize: 11,
      margin: [0, 5, 0, 5]
    }
  };

  const tableLayouts = {
    header: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      fillColor: '#5D323E'
    },
    noInnerBorder: {
      hLineWidth: (i, node) => i === 0 || i === node.table.body.length ? 1 : 0,
      vLineWidth: (i, node) => i === 0 || i === node.table.widths.length ? 1 : 0,
    },
    noBorders: {
      hLineWidth: () => 0,
      vLineWidth: () => 0
    }
  };

  const fonts = {
    Roboto: {
      normal: getPath('../resources/fonts/Roboto-Regular.ttf'),
      bold: getPath('../resources/fonts/Roboto-Bold.ttf'),
      italics: getPath('../resources/fonts/Roboto-Italic.ttf'),
      bolditalics: getPath('../resources/fonts/Roboto-BoldItalic.ttf')
    }
  };

  const printer = new pdfmake(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition, {
    tableLayouts
  });
  pdfDoc.end();

  await sendMail({
    to: user.email,
    subject: 'Creación de Tarjeta INAPAM',
    text: 'Creación de Tarjeta INAPAM',
    attachments: [
      {
        filename: `${user.curpText} - INAPAM.pdf`,
        content: pdfDoc,
        contentType: 'application/pdf'
      }
    ]
  });
};

module.exports = {
  find,
  findFile,
  insert,
  generatePdf
};