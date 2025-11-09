import { Text, ScrollView, Linking, StyleSheet, View } from 'react-native';
import React from 'react';

const Terms = () => {
  return (
    <ScrollView style={{ maxHeight: 400 }}>
      <Text style={styles.title}>Termini e Condizioni d’Uso</Text>

      {/* 1 */}
      <Text style={styles.sectionTitle}>1. Informazioni generali</Text>
      <Text style={styles.paragraph}>
        L’applicazione <Text style={styles.bold}>CDBapp</Text> (di seguito “l’App”) è sviluppata e gestita da{' '}
        <Text style={styles.bold}>K12 – APS</Text>, associazione senza scopo di lucro con sede in Italia. {'\n'}
        Sito ufficiale:{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.coderdojobrianza.it')}
        >
          www.coderdojobrianza.it
        </Text>
        .{'\n'}
        L’utilizzo dell’App implica l’accettazione completa dei presenti{' '}
        <Text style={styles.bold}>Termini e Condizioni</Text>. Se non accetti anche solo una parte di queste condizioni,
        ti invitiamo a non utilizzare l’App.
      </Text>

      {/* 2 */}
      <Text style={styles.sectionTitle}>2. Destinatari dell’App</Text>
      <Text style={styles.paragraph}>
        L’App è destinata a utenti di età <Text style={styles.bold}>superiore ai 14 anni</Text>. {'\n'}
        Utilizzando l’App dichiari di avere almeno 14 anni e di possedere la capacità legale di accettare i presenti
        Termini.
      </Text>

      {/* 3 */}
      <Text style={styles.sectionTitle}>3. Funzionalità dell’App</Text>
      <Text style={styles.paragraph}>
        CDBapp consente di:{'\n'}
        • Visualizzare i prossimi eventi organizzati da K12 – APS{'\n'}
        • Ricevere notifiche sugli eventi{'\n'}
        • Iscriversi alla newsletter{'\n'}
        • Consultare gli ultimi articoli del blog ufficiale{'\n'}
        • Registrarsi per segnare la propria partecipazione e monitorare i progressi
      </Text>

      {/* 4 */}
      <Text style={styles.sectionTitle}>4. Registrazione e account utente</Text>
      <Text style={styles.paragraph}>
        Per utilizzare alcune funzionalità è necessario creare un account, fornendo{' '}
        <Text style={styles.bold}>nome</Text>, <Text style={styles.bold}>cognome</Text>,{' '}
        <Text style={styles.bold}>indirizzo email</Text> e una <Text style={styles.bold}>password</Text>. {'\n'}
        L’utente è responsabile della riservatezza delle proprie credenziali e di tutte le attività svolte con il proprio
        account. {'\n'}
        <Text style={styles.bold}>K12 – APS</Text> non potrà essere ritenuta responsabile per eventuali accessi non
        autorizzati dovuti a negligenza dell’utente.
      </Text>

      {/* 5 */}
      <Text style={styles.sectionTitle}>5. Protezione dei dati personali</Text>
      <Text style={styles.paragraph}>
        I dati forniti dagli utenti vengono trattati nel rispetto del{' '}
        <Text style={styles.bold}>Regolamento (UE) 2016/679 (GDPR)</Text> e della normativa italiana vigente. {'\n'}
        Le informazioni personali (nome, cognome, email e password cifrata) vengono utilizzate esclusivamente per
        consentire il funzionamento dell’App e la gestione delle attività associative. {'\n'}
        Per maggiori dettagli, consulta l’{' '}
        <Text
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              'https://www.coderdojobrianza.it/chi-siamo/tutela-della-privacy-con-coderdojo-brianza/'
            )
          }
        >
          Informativa sulla Privacy
        </Text>
        .
      </Text>

      {/* 6 */}
      <Text style={styles.sectionTitle}>6. Proprietà intellettuale</Text>
      <Text style={styles.paragraph}>
        Tutti i contenuti, loghi, testi e immagini presenti nell’App sono di proprietà di{' '}
        <Text style={styles.bold}>K12 – APS</Text> o utilizzati con licenza. {'\n'}
        È vietata la copia, la distribuzione o la modifica dei contenuti senza autorizzazione scritta.
      </Text>

      {/* 7 */}
      <Text style={styles.sectionTitle}>7. Limitazione di responsabilità</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>K12 – APS</Text> non garantisce il funzionamento continuo, privo di errori o
        interruzioni dell’App. {'\n'}
        L’App è fornita “così com’è” e l’associazione non è responsabile per eventuali danni diretti o indiretti
        derivanti dall’utilizzo dell’App.
      </Text>

      {/* 8 */}
      <Text style={styles.sectionTitle}>8. Modifiche ai termini</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>K12 – APS</Text> si riserva il diritto di modificare in qualsiasi momento i presenti
        Termini e Condizioni. {'\n'}
        Le modifiche saranno comunicate tramite aggiornamenti dell’App o pubblicazione sul sito ufficiale.
      </Text>

      {/* 9 */}
      <Text style={styles.sectionTitle}>9. Contatti</Text>
      <Text style={styles.paragraph}>
        Per domande, segnalazioni o richieste di assistenza:{'\n'}
        📧{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('mailto:info@coderdojobrianza.it')}
        >
          info@coderdojobrianza.it
        </Text>{'\n'}
        🌐{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.coderdojobrianza.it')}
        >
          www.coderdojobrianza.it
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default Terms;