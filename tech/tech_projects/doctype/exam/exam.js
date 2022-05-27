// Copyright (c) 2022, alex and contributors
// For license information, please see license.txt

frappe.ui.form.on('Exam', {
	refresh: function(frm) {
		if( ! frm.doc.__isocal && frm.doc.status == "Open" && frm.doc.the_number_of_users > frm.doc.attended_count){
			var currentdate = new Date(); 
			var datetime =  
				+ currentdate.getFullYear() + "-"  
               +0 + (currentdate.getMonth()+1)  + "-" 
               + currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
			if(datetime <= frm.doc.slot_close  ){
				frm.add_custom_button(__('Go To Exam Page'), function () {
					frappe.set_route("exam-page", frm.doc.name)
				},);
			}
			
		}
	}
});
