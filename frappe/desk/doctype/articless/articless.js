// Copyright (c) 2025, Frappe Technologies and contributors
// For license information, please see license.txt


frappe.ui.form.on('Articless', {
    after_save: function(frm) {
        calculateTotal(frm);
    }
});

frappe.ui.form.on('Articles calculer', {
    // Déclencher le calcul lorsqu'un nouvel enregistrement est ajouté à la sous-table
    refresh: function(frm) {
        calculateTotal(frm);
    }
});

// Fonction pour calculer et mettre à jour le champ "total" avec le suffixe "CFA"
function calculateTotal(frm) {
    var total = 0;

    // Parcourir tous les enregistrements de la sous-table
    $.each(frm.doc.articles || [], function(i, article) {
        total += flt(article.prix || 0);
    });

    // Formater le total en tant que devise avec des espaces séparateurs par millier
    var formattedTotal = frappe.format(format_currency(total, frm.doc.currency));
    
    // Ajouter le suffixe "CFA" à la valeur calculée
    var totalWithSuffix = formattedTotal /*+ " CFA"*/;

    // Mettre à jour le champ "total" dans le doctype "Articles liens"
    frappe.model.set_value(frm.doctype, frm.docname, 'total', totalWithSuffix);

    // Rafraîchir le formulaire pour afficher la mise à jour
    frm.refresh_field('total');
}

