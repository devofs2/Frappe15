# Copyright (c) 2024, Frappe Technologies and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe import _
from frappe.utils import get_url


"""class Ecos(Document):
    #pass
    def onload(self):
        frappe.msgprint("onload_post called")
        # Vérifier si le document est en cours de création
        if not self.is_new() and frappe.session.user != self.custom_utilisateur:
            frappe.msgprint("Accès refusé")
            frappe.throw("Vous n'avez pas la permission d'accéder à ce document.")

        # Vérifications spécifiques lors de l'ouverture du document
        allowed_user = frappe.session.user  
        user_found = False

        # Récupérer les données de la table associée
        user_table_data = frappe.get_all(self.custom_utilisateurs, filters={"parent": self.name})

        for row in user_table_data:
            if row.get("utilisateur") == allowed_user:
                user_found = True
                break

        if not user_found:
            frappe.msgprint("Vous n'avez pas la permission d'accéder à ce document pour l'utilisateur {0}.".format(allowed_user))
            #frappe.msgprint(f"Vous n'avez pas la permission d'accéder à ce document pour l'utilisateur {allowed_user}.")
            frappe.throw("Accès refusé.")"""

class Ecos(Document):
    def onload(self):
        allowed_user = frappe.session.user  
        user_found = False

        """# Récupérer les données de la table associée
        user_table_data = frappe.get_all("Ma table", filters={"parent": self.name})
        
        # Utilisez une liste pour stocker les noms d'utilisateurs autorisés
        users_in_table = [row.get("utilisateur") for row in user_table_data]"""

        if allowed_user in ["olade.affoyon@ofs.bj", "nadine.obisesan@ofs.bj"]:
            user_found = True
            

        for a in self.custom_utilisateurs:
            if allowed_user == a.utilisateur:
                user_found = True

        """frappe.msgprint("Allowed User: {}".format(allowed_user))
        frappe.msgprint("Users in Table: {}".format(users_in_table))
        frappe.msgprint("Users in Tabl: {}".format(self.custom_utilisateurs))
        frappe.msgprint("Users in Tabl: {}".format(user_found))"""

        """if allowed_user in users_in_table:
            user_found = True"""

        if not user_found:
            msg = "Vous n'avez pas la permission d'accéder à ce document pour l'utilisateur {}.".format(allowed_user)
            frappe.msgprint(msg)
            frappe.throw("Permission non accordée")




@frappe.whitelist()
def send_meeting_invitation_email(recipient_emails, subject, content):
    try:
        frappe.sendmail(
            recipients=recipient_emails,
            sender=frappe.session.user,
            subject=subject,
            message=content,
            now=True
        )
        return {'success': True}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _('Failed to send email'))
        return {'success': False, 'error_message': str(e)}




"""@frappe.whitelist()
def send_meeting_invitation_email(recipient_emails, subject, content):
    try:
        frappe.logger().info(f'Sending email to: {recipient_emails}')
        
        frappe.sendmail(
            recipients=recipient_emails,
            sender=frappe.session.user,
            subject=subject,
            message=content,
            now=True
        )
        return {'success': True}
    except Exception as e:
        frappe.logger().error(f'Error sending email: {str(e)}')
        return {'success': False, 'error_message': str(e)}"""


"""frappe.sendmail(
    recipients=['"mafoya.adingni@ofs.bj"'],
    sender=frappe.session.user,
    subject='Test d\'envoi d\'e-mail',
    message='Ceci est un test d\'envoi d\'e-mail depuis la console Python de Frappe.'
)"""






