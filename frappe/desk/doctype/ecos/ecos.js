// Copyright (c) 2024, Frappe Technologies and contributors
// For license information, please see license.txt

frappe.ui.form.on("Ecos", {
    after_save(frm) {
        // Vérifier si l'e-mail a déjà été envoyé
        if (!frm.doc.custom_email_envoye) {
            // Vérifier si le champ custom_utilisateurs est renseigné
            if (frm.doc.custom_utilisateurs && frm.doc.custom_utilisateurs.length > 0) {
                // Construire le contenu du message avec le lien du document
                //const messageContent = `Vous êtes conviés à la réunion intitulé <strong>"${frm.doc.rsd}"</strong> prévue le ${frm.doc.custom_date}. L'ordre du jour de cette réunion est le suivant:\n<strong>${frm.doc.custom_ordre}</strong> \n\nPour plus de détails, cliquez ${getDocLink(frm)}`;
                let messageContent = `Vous êtes conviés à la réunion intitulée <strong>"${frm.doc.rsd}"</strong> prévue le ${frm.doc.custom_date}. L'ordre du jour de cette réunion est le suivant:\n<strong>${frm.doc.custom_ordre}</strong>`;

                // Ajouter le lien Google Meet s'il y a une valeur dans le champ "lien"
                if (frm.doc.rsd) {
                    messageContent += `\n\nCi-joint le lien Google Meet: <a href="${frm.doc.rsd}" target="_blank">Lien Google Meet</a>.`;
                }

                // Ajouter la phrase finale
                messageContent += `\n\nPour plus de détails, cliquez ${getDocLink(frm)}`;

                // Extraire les adresses e-mail des destinataires
                const recipientEmails = frm.doc.custom_utilisateurs.map(user => user.utilisateur);

                // Vérifier le format des adresses e-mail
                const isValidEmail = (email) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                };

                // Filtrer les adresses e-mail valides
                const validRecipientEmails = recipientEmails.filter(email => isValidEmail(email));

                // Envoyer uniquement si au moins une adresse e-mail est valide
                if (validRecipientEmails.length > 0) {
                    sendMeetingInvitationEmail(validRecipientEmails.join(', '), 'Convocation à une réunion à OWO FINANCIAL SERVICES', messageContent);

                    // Marquer le champ email_envoye comme vrai
                    frappe.model.set_value(frm.doctype, frm.doc.name, 'email_envoye', 1);
                    frm.refresh_field('email_envoye');
                } else {
                    frappe.msgprint(__('Aucune adresse e-mail valide trouvée dans la liste des destinataires.'));
                }
            }
        }
    }
});


// Fonction pour obtenir le lien du document
function getDocLink(frm) {
    return `<a href="${frappe.utils.get_form_link('Ecos', frm.doc.name)}">réunion.</a>`;
}

// Fonction pour envoyer l'e-mail
function sendMeetingInvitationEmail(recipientEmails, subject, messageContent) {
    console.log('Sending email to:', recipientEmails);

    frappe.call({
        method: 'frappe.desk.doctype.ecos.ecos.send_meeting_invitation_email',
        args: {
            'recipient_emails': recipientEmails,
            'subject': subject,
            'content': messageContent
        },
        callback: function(response) {
            if (response.message && response.message.success) {
                frappe.msgprint(__('E-mail envoyé avec succès aux participants'));
            } else {
                frappe.msgprint(__('Échec de l\'envoi de l\'e-mail'));
            }
        }
    });
}

