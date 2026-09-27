-- Contenido traducible por evento (description/marina). Null = solo inglés
-- (fallback automático en frontend). Evita una columna nueva por idioma.
alter table public.events add column if not exists content_i18n jsonb;

update public.events set content_i18n = jsonb_build_object(
  'es', jsonb_build_object(
    'description', 'SunGlam — Sunset Boat Party con DJ set de Ágatha Sun. Cinco horas recorriendo la costa sur de Gran Canaria mientras cae el sol, con house, deep house, melodic y tech house a bordo de una embarcación que solo revelamos en el momento de embarcar.

Aforo limitado a 40 personas — sin masificación, sin concesiones. Un welcome drink te espera nada más subir a bordo, y después toca música, océano y buen rollo hasta que el atardecer pinta el cielo de dorado.

Incluye:
– Welcome drink de bienvenida
– Bebidas a bordo: agua, cerveza, refrescos, sangría
– Almuerzo: papas arrugadas con mojo, ensalada coleslaw, pollo marinado
– Banana boat y equipo de snorkel a bordo
– Tiempo libre para el baño por la costa sur

El punto de embarque exacto se comparte de forma privada por WhatsApp 24 horas antes de la salida — solo tienes que presentarte, del resto nos encargamos nosotros.',
    'marina', 'Punto de embarque exacto, revelado por WhatsApp 24h antes de la salida'
  ),
  'it', jsonb_build_object(
    'description', 'SunGlam — Sunset Boat Party con DJ set di Ágatha Sun. Cinque ore lungo la costa sud di Gran Canaria mentre il sole tramonta, tra house, deep house, melodic e tech house a bordo di un''imbarcazione che riveleremo solo al momento dell''imbarco.

Massimo 40 ospiti — niente folla, nessun compromesso. Un welcome drink ti aspetta appena sali a bordo, poi musica, oceano e buona energia fino a quando il tramonto colora il cielo d''oro.

Include:
– Welcome drink di benvenuto
– Bevande a bordo: acqua, birra, bibite, sangria
– Pranzo: patate rugose con mojo, coleslaw, pollo marinato
– Banana boat e attrezzatura da snorkeling a bordo
– Tempo libero per il bagno lungo la costa sud

Il punto di imbarco esatto viene comunicato in privato su WhatsApp 24 ore prima della partenza — ti basta presentarti, al resto pensiamo noi.',
    'marina', 'Punto di imbarco esatto comunicato su WhatsApp 24h prima della partenza'
  ),
  'de', jsonb_build_object(
    'description', 'SunGlam — Sunset Boat Party mit DJ-Set von Ágatha Sun. Fünf Stunden entlang der Südküste von Gran Canaria, während die Sonne untergeht — House, Deep House, Melodic und Tech House an Bord eines Schiffs, das wir erst beim Boarding verraten.

Begrenzt auf 40 Gäste — keine Menschenmassen, keine Kompromisse. Ein Welcome-Drink erwartet dich schon an der Gangway, danach heißt es Musik, Meer und gute Stimmung, bis der Sonnenuntergang den Himmel golden färbt.

Inklusive:
– Welcome-Drink beim Boarding
– Getränke an Bord: Wasser, Bier, Softdrinks, Sangria
– Mittagessen: Wrinkled Potatoes mit Mojo, Coleslaw, mariniertes Hähnchen
– Bananaboat-Fahrt & Schnorchelausrüstung an Bord
– Freie Schwimmzeit entlang der Südküste

Der genaue Abfahrtsort wird 24 Stunden vor Abfahrt privat per WhatsApp mitgeteilt — einfach erscheinen, um den Rest kümmern wir uns.',
    'marina', 'Genauer Abfahrtsort wird 24h vor Abfahrt per WhatsApp mitgeteilt'
  ),
  'no', jsonb_build_object(
    'description', 'SunGlam — Sunset Boat Party med DJ-sett fra Ágatha Sun. Fem timer langs sørkysten av Gran Canaria mens solen går ned, med house, deep house, melodic og tech house om bord på en båt vi først avslører når det er tid for ombordstigning.

Begrenset til 40 gjester — ingen folkemengder, ingen kompromisser. En velkomstdrink venter deg ved landgangen, så blir det musikk, hav og god stemning helt til solnedgangen maler himmelen gyllen.

Inkluderer:
– Velkomstdrink ved ombordstigning
– Drikke om bord: vann, øl, brus, sangria
– Lunsj: rynkede poteter med mojo, coleslaw, marinert kylling
– Bananbåttur & snorkleutstyr om bord
– Fri badetid langs sørkysten

Nøyaktig oppmøtested deles privat på WhatsApp 24 timer før avgang — bare møt opp, resten ordner vi.',
    'marina', 'Nøyaktig oppmøtested deles på WhatsApp 24t før avgang'
  ),
  'nl', jsonb_build_object(
    'description', 'SunGlam — Sunset Boat Party met een dj-set van Ágatha Sun. Vijf uur varen langs de zuidkust van Gran Canaria terwijl de zon ondergaat, met house, deep house, melodic en tech house aan boord van een boot die we pas onthullen bij het instappen.

Beperkt tot 40 gasten — geen drukte, geen compromissen. Een welkomstdrankje staat voor je klaar zodra je aan boord stapt, daarna is het genieten van muziek, oceaan en goede vibes tot de zonsondergang de lucht goud kleurt.

Inclusief:
– Welkomstdrankje bij het instappen
– Drankjes aan boord: water, bier, frisdrank, sangria
– Lunch: gekreukelde aardappelen met mojo, coleslaw, gemarineerde kip
– Bananenboot & snorkeluitrusting aan boord
– Vrije zwemtijd langs de zuidkust

Het exacte opstappunt wordt 24 uur voor vertrek privé gedeeld via WhatsApp — kom gewoon opdagen, de rest regelen wij.',
    'marina', 'Exact opstappunt wordt 24u voor vertrek gedeeld via WhatsApp'
  )
)
where slug = 'sunglam-sunset-24-oct';
