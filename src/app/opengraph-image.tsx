import { ImageResponse } from 'next/og';

export const alt = 'Lótus — Contos Orientais e Reflexões Intrapessoais';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          backgroundColor: '#EDE0C8',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(200, 46, 54, 0.08) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(20, 20, 22, 0.05) 0%, transparent 50%)',
          border: '16px solid #CBB389',
          fontFamily: 'serif',
          color: '#141416',
          boxSizing: 'border-box',
        }}
      >
        {/* Topo: Selo Hanko e indicação editorial */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                border: '3px solid #C82E36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C82E36',
                fontSize: '34px',
                fontWeight: 'bold',
                backgroundColor: 'rgba(200, 46, 54, 0.06)',
              }}
            >
              蓮
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  color: '#141416',
                }}
              >
                LÓTUS
              </span>
              <span
                style={{
                  fontSize: '15px',
                  color: '#4A463F',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Edição Digital do Autor
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: '28px',
              color: '#C82E36',
              letterSpacing: '0.2em',
            }}
          >
            終わり
          </div>
        </div>

        {/* Centro: Título e citação comovente */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 600,
              lineHeight: 1.15,
              color: '#000000',
              maxWidth: '1000px',
            }}
          >
            Contos orientais sob uma ótica intrapessoal
          </div>
          <div
            style={{
              fontSize: '24px',
              lineHeight: 1.5,
              color: '#4A463F',
              fontStyle: 'italic',
              maxWidth: '920px',
            }}
          >
            &ldquo;Nem todos os grandes confrontos acontecem nos campos de batalha.
            Os mais difíceis acontecem dentro da nossa mente.&rdquo;
          </div>
        </div>

        {/* Rodapé: Autor e recursos interativos */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(20, 20, 22, 0.15)',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '24px', fontSize: '18px', color: '#141416' }}>
            <span><strong>Davi Xavier</strong>, 16 anos</span>
            <span style={{ color: '#4A463F' }}>·</span>
            <span>Prefácio e Capítulos 1, 2 e 3</span>
            <span style={{ color: '#4A463F' }}>·</span>
            <span>Audiobook Completo em 2 vozes</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#C82E36',
              color: '#FAF6EB',
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '17px',
              fontWeight: 500,
            }}
          >
            Ler e Ouvir Agora
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
