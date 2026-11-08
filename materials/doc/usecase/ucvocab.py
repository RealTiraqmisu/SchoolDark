# -*- coding: utf-8 -*-
# ส่วนกลาง: ค่า vML, สร้าง XML ของตาราง uc หนึ่งใบ

ORANGE = '<w:color w:val="E97132" w:themeColor="accent2"/>'
BLUE = '<w:color w:val="0070C0"/>'
BOLD_TPL = '<w:rPr><w:rFonts w:ascii="Tahoma" w:eastAsia="Tahoma" w:hAnsi="Tahoma"/><w:color w:val="E97132" w:themeColor="accent2"/><w:t xml:space="preserve">%s</w:t></w:rPr>'
LABEL_L = '<w:rPr>'

_forbidden_current = dict()


def esc(s):
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    s = s.replace('"', "&quot;")
    return s


def color_of(is_new):
    return BLUE if is_new else ORANGE


def paras(items, is_new):
    """items: list of (text, is_bold) หรือ str"""
    c = color_of(is_new)
    out = []
    for it in items:
        t, b = (it if isinstance(it, tuple) else (it, False))
        if not out:
            out.append('<w:p><w:pPr><w:adjustRightInd w:val="0"/><w:snapToGrid w:val="0"/><w:spacing w:after="120" w:line="240" w:lineRule="auto"/></w:pPr>')
        else:
            out.append('<w:p><w:pPr><w:adjustRightInd w:val="0"/><w:snapToGrid w:val="0"/><w:spacing w:after="120" w:line="240" w:lineRule="auto"/><w:ind w:left="430"/></w:pPr>')
        rpr = '<w:rPr><w:rFonts w:ascii="Tahoma" w:eastAsia="Tahoma" w:hAnsi="Tahoma"/>%s%s</w:rPr>' % (c, '<w:b/>' if b else '')
        out.append('<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r></w:p>' % (rpr, esc(t)))
    return ''.join(out)


def label_p(text):
    return ('<w:p><w:pPr><w:adjustRightInd w:val="0"/><w:snapToGrid w:val="0"/>'
            '<w:spacing w:after="120" w:line="240" w:lineRule="auto"/></w:pPr>'
            '<w:r><w:rPr><w:rFonts w:ascii="Tahoma" w:eastAsia="Tahoma" w:hAnsi="Tahoma"/>'
            '<w:color w:val="E97132" w:themeColor="accent2"/></w:rPr>'
            '<w:t xml:space="preserve">%s</w:t></w:r></w:p>' % esc(text))


def cell(tcpr, content_kind, content, is_new=None, spans=None):
    if spans:
        tcpr += '<w:gridSpan w:val="%d"/>' % spans
    if content_kind == 'paras':
        body = paras(content, is_new)
    elif content_kind == 'label':
        body = label_p(content)
    else:  # raw paragraphs list (paras-cells สำหรับชื่อ uc / ID)
        body = content
    return '<w:tc>%s%s</w:tc>' % (tcpr, body)


def tcmar():
    return '<w:tcMar><w:top w:w="57" w:type="dxa"/><w:left w:w="57" w:type="dxa"/><w:bottom w:w="57" w:type="dxa"/><w:right w:w="57" w:type="dxa"/></w:tcMar>'


def tcpr(width, is_new=None):
    c = '<w:color w:val="auto" w:themeColor="%s"/>' if False else ''
    r = '<w:tcPr><w:tcW w:w="%d" w:type="dxa"/><w:borders>%s</w:borders>%s<w:vAlign w:val="center"/></w:tcPr>'
    return r % (width, BORDERS, tcmar())


def table_for(u):
    # row 1: name (3-col row: label col+val col merged? เก็บแบบ 3 คอลัมน์)
    r1 = ('<w:tcPr><w:tcW w:w="2886" w:type="dxa"/><w:borders>%s</w:borders>%s<w:vAlign w:val="center"/></w:tcPr>' % (BORDERS, tcmar()),
          '<w:tcPr><w:tcW w:w="210" w:type="dxa"/><w:borders>%s</w:borders>%s<w:vAlign w:val="center"/></w:tcPr>' % (BORDERS, tcmar()),
          '<w:tcPr><w:tcW w:w="5116" w:type="dxa"/><w:borders>%s</w:borders>%s<w:vAlign w:val="center"/></w:tcPr>' % (BORDERS, tcmar()))
    uc_name = ['Use Case Name', u['name'], 'ID: ' + u['id']]
    return uc_name


def build_table(u):
    BORDER='<w:top w:val="single" w:sz="8" w:color="000000"/><w:left w:val="single" w:sz="8" w:color="000000"/><w:bottom w:val="single" w:sz="8" w:color="000000"/><w:right w:val="single" w:sz="8" w:color="000000"/>'
    def tcell(width, body, spans=1, vt='center'):
        tcpr = ('<w:tcPr><w:tcW w:w="%d" w:type="dxa"/>%s%s<w:vAlign w:val="%s"/></w:tcPr>'
                % (width,
                   ('<w:gridSpan w:val="%d"/>' % spans) if spans > 1 else '',
                   '<w:tcMar><w:top w:w="57" w:type="dxa"/><w:left w:w="57" w:type="dxa"/><w:bottom w:w="57" w:type="dxa"/><w:right w:w="57" w:type="dxa"/></w:tcMar>',
                   vt))
        return '<w:tc>%s%s</w:tc>' % (tcpr, body)

    # Row 1: Use Case Name | ชื่อของเข้าหมาย | ID: xxx
    r1 = ('<w:tr><w:tblPr/><w:trPr><w:trHeight w:val="530" w:hRule="atLeast"/></w:trPr>'
          + tcell(2886, ''.join([
              '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:ascii="Trebuchet MS" w:eastAsia="Trebuchet MS" w:hAnsi="Trebuchet MS"/><w:color w:val="E97132" w:themeColor="accent2"/></w:rPr><w:t xml:space="preserve">Use Case Name</w:t></w:r></w:p>'],),
          + tcell(210, '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Tahoma" w:eastAsia="Tahoma" w:hAnsi="Tahoma"/></w:rPr><w:t xml:space="preserve">&#160;</w:t></w:r></w:p>')
          + tcell(5116, ''.join([
              '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Tahoma" w:eastAsia="Tahoma" w:hAnsi="Tahoma"/>%s</w:rPr><w:t xml:space="preserve">%s</w:t></w:r></w:p><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Tahoma" w:eastAsia="Tahoma" w:hAnsi="Tahoma"/>%s</w:rPr><w:t xml:space="preserve">ID: %s</w:t></w:r></w:p>' % (color_of(u['new']), esc(u['name']), color_of(u['new']), u['id')])
          + '</w:tr>')
    return r1
