// Copyright (c) 2022, alex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Exam', {
	refresh: function(frm) {
		frm.add_custom_button(__('Go To Exam Page'), function () {
			frappe.set_route("exam-page")
		},);

	}
});
