export const REFRESH_INTERVAL_MS = 60_000
export const MACRO_REFRESH_INTERVAL_MS = 3_600_000

export const YAHOO_TICKERS = {
  SP500:   '^GSPC',
  NASDAQ:  '^IXIC',
  DOW:     '^DJI',
  KOSPI:   '^KS11',
  KOSDAQ:  '^KQ11',
  VIX:     '^VIX',
  GOLD:    'GC=F',
  OIL:     'CL=F',
  DXY:     'DX-Y.NYB',
  USDKRW:  'KRW=X',
}

export const FRED_SERIES = {
  CPI:          'CPIAUCSL',
  FED_FUNDS:    'FEDFUNDS',
  UNEMPLOYMENT: 'UNRATE',
  GDP_GROWTH:   'A191RL1Q225SBEA',
}

export const TICKER_NAMES: Record<string, string> = {
  '^GSPC':    'S&P 500',
  '^IXIC':    'NASDAQ',
  '^DJI':     'Dow Jones',
  '^KS11':    'KOSPI',
  '^KQ11':    'KOSDAQ',
  '^VIX':     'VIX',
  'GC=F':     '금 (Gold)',
  'CL=F':     'WTI 원유',
  'DX-Y.NYB': '달러인덱스',
  'KRW=X':    'USD/KRW',
}

export const TICKER_CURRENCY: Record<string, string> = {
  '^GSPC':    'USD',
  '^IXIC':    'USD',
  '^DJI':     'USD',
  '^KS11':    'KRW',
  '^KQ11':    'KRW',
  '^VIX':     '',
  'GC=F':     'USD',
  'CL=F':     'USD',
  'DX-Y.NYB': '',
  'KRW=X':    'KRW',
}
