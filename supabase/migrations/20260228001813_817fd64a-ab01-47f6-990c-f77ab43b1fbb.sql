
INSERT INTO system_config (key, value, owner_id) VALUES
(
  'client_tags',
  '[
    {"id":"t1","name":"VIP","color":"#f59e0b","isActive":true},
    {"id":"t2","name":"Frequente","color":"#22c55e","isActive":true},
    {"id":"t3","name":"Nova","color":"#3b82f6","isActive":true},
    {"id":"t4","name":"Indicação","color":"#a855f7","isActive":true},
    {"id":"t5","name":"Parceria","color":"#ec4899","isActive":true},
    {"id":"t6","name":"Pacote","color":"#14b8a6","isActive":true},
    {"id":"t7","name":"Gestante","color":"#ef4444","isActive":true},
    {"id":"t8","name":"Aniversariante","color":"#f97316","isActive":true}
  ]'::jsonb,
  '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b'
),
(
  'whatsapp_templates',
  '[
    {"id":"w1","name":"Confirmação de Agendamento","content":"Olá {nome}! 😊 Seu bronze está confirmado para o dia {data} às {hora}. Qualquer dúvida, estamos à disposição! ✨","includePixKey":false},
    {"id":"w2","name":"Lembrete (véspera)","content":"Oi {nome}! 💛 Passando para lembrar do seu bronze amanhã, dia {data} às {hora}. Te esperamos! ✨","includePixKey":false,"reminderMinutesBefore":1440},
    {"id":"w3","name":"Lembrete (2h antes)","content":"Oi {nome}! ⏰ Seu bronze é daqui a 2 horas, às {hora}. Nos vemos em breve! 😘","includePixKey":false,"reminderMinutesBefore":120},
    {"id":"w4","name":"Pós-atendimento","content":"Oi {nome}! 🥰 Obrigada pela confiança! Espero que tenha amado o resultado. Qualquer dúvida sobre os cuidados, me chama! 💛","includePixKey":false},
    {"id":"w5","name":"Cobrança com Pix","content":"Olá {nome}! 😊 Segue a chave Pix para pagamento do seu bronze:\n\n{pix}\n\nValor: R$ {valor}\n\nQualquer dúvida estou à disposição! 💛","includePixKey":true},
    {"id":"w6","name":"Aniversário","content":"Feliz aniversário, {nome}! 🎂🎉 Desejamos um dia maravilhoso! Temos um presente especial para você. Entre em contato! 💛✨","includePixKey":false}
  ]'::jsonb,
  '90b0a703-9dc0-4d3d-a4bd-eca45fdf255b'
);
