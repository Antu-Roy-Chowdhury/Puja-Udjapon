// lib/googleSheets.ts
import { google } from "googleapis"

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!

export async function getSheet(sheetName: string) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
  })
  return res.data.values || []
}

export async function appendRow(sheetName: string, row: any[]) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
    valueInputOption: "RAW",
    requestBody: {
      values: [row],
    },
  })
}

export async function updateCell(range: string, value: any) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [[value]],
    },
  })
}

export async function deleteRow(sheetName: string, rowNumber: number) {
  const sheetIdRes = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  })

  const sheet = sheetIdRes.data.sheets?.find(
    (s) => s.properties?.title === sheetName
  )

  const sheetId = sheet?.properties?.sheetId

  if (sheetId === undefined) throw new Error("Sheet not found")

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowNumber - 1,
              endIndex: rowNumber,
            },
          },
        },
      ],
    },
  })
}

