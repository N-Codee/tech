frappe.pages['exam-page'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Exam Page',
		single_column: true
	});
}

frappe.pages['exam-page'].on_page_show = function(wrapper) {
	var route = frappe.get_route();
	if(route.length>1) {
		frappe.model.with_doc('Exam', route[1], function() {
			frappe.exam_page.exam = frappe.get_doc('Exam', route[1]);
			frappe.exam_page.refresh();
		});
	}
	else {
		frappe.exam_page.exam = frappe.route_options.doc;
		frappe.route_options = null;
		frappe.exam_page.refresh();
	}
}
frappe.pages['exam-page'].on_page_load = function(wrapper) {
	frappe.exam_page = new frappe.ExamPage(wrapper);		
	frappe.exam_page.refresh();
}

frappe.ExamPage = Class.extend({
	init: function(parent) {
		this.parent = parent;
		this.make();
		this.refresh();
	},
	make: function() {
		this.page = frappe.ui.make_app_page({
			parent: this.parent,
			title: __("Exam"),
			single_column: true
		});
		this.page.main.css({"border-color": "transparent"});
		
	},

	refresh: function() {	
		if(!this.exam) {
			this.show_start();
		} else {
		
			this.page.set_title(this.exam.name);
			this.exam_generator();		
			
		}
		
	},
	show_start: function() {
		this.page.main.html(frappe.render_template("exam_start", {}));
		this.page.sidebar.html("");
		this.page.clear_actions_menu();
		this.page.set_title(__("Exam"));
		
		this.start_data();	
	},
	start_data: function() {
		var me = this;
		var exam_selector = frappe.ui.form.make_control({
			parent: this.page.main.find(".exam-selector"),
			df: {
				fieldtype: "Link",
				fieldname: "exam",
				options: "Exam",
			//	read_only: '1',
				change: () => {
					if (exam_selector.get_value()){
						this.exam_name = exam_selector.get_value();
					}
				},
				filters: {
					docstatus: 0
				},
				label: __("Select a record"),
				only_select: true
			},
			render_input: true
		});
		this.page.main.find(".btn-start-exam").on("click", function() {
			
			var name = me.exam_name;
		
			if(!name) return;
			frappe.set_route('exam-page', name);
		});
	},
	exam_generator: function() {
		var me = this;
		frappe.model.with_doctype(this.exam.doctype, (doctype) =>{
			me.meta = frappe.get_meta(me.exam.doctype);
			me.render_layout();
			me.page.add_action_item(__('Save'), function(){
				me.save(accept=1);
			});
		});
	},
	render_layout: function() {
		this.page.main.empty();
		$(frappe.render_template("exam_utility", {
			data: this.layout_data, me: this}))
			.appendTo(this.page.main);
		this.setup_details_form();
		this.setup_details();
	},
	setup_details_form() {
		this.exam_no = frappe.ui.form.make_control({
			parent: this.page.main.find(".exam-no"),
			df: {
				fieldtype: "Link",
				fieldname: "exam",
				options: 'Exam',
				read_only: '0',
				label: __("Exam Record"),
			},
			render_input: true
		});
		this.exam_title = frappe.ui.form.make_control({
			parent: this.page.main.find(".exam-title"),
			df: {
				fieldtype: "Data",
				fieldname: "exam_title",
				read_only: '0',
				label: __("Exam Title"),
			},
			render_input: true
		});
		this.full_name = frappe.ui.form.make_control({
			parent: this.page.main.find(".full-name"),
			df: {
				fieldtype: "Data",
				fieldname: "full_name",
				read_only: '0',
				label: __("Full Name"),
			},
			render_input: true
		});
		this.e_mail = frappe.ui.form.make_control({
			parent: this.page.main.find(".e-mail"),
			df: {
				fieldtype: "Data",
				fieldname: "e_mail",
				label: __("E-Mail"),
			},
			render_input: true
		});
		this.exam_start_time = frappe.ui.form.make_control({
			parent: this.page.main.find(".exam-start-time"),
			df: {
				fieldtype: "Datetime",
				fieldname: "exam_start_time",
				label: __("Exam Start Time"),
			},
			render_input: true
		});

		this.exam_end_time = frappe.ui.form.make_control({
			parent: this.page.main.find(".exam-end-time"),
			df: {
				fieldtype: "Data",
				fieldname: "exam_end_time",
				label: __("Exam End Time"),
			},
			render_input: true
		});
		
	},
	setup_details: function() {
		var me = this;
		frappe.db.get_doc('Exam', this.exam.name).then((doc) => {
			this.exam = doc;
		
		me.exam_no.set_value(this.exam.name);
		me.exam_title.set_value(this.exam.exam_title);
		me.exam_start_time.set_value(this.exam.slot_open);
		me.exam_end_time.set_value(this.exam.slot_close);
		me.html_data();
	});
	},
	html_data() {
		var me = this;
		
		let oqc = me.exam.name;
		if (!oqc) {
			this.form.get_field('preview').html('');
			return;
		}
		this.test()
		
	},

	test(){
		$(frappe.render_template("test", {	
			data: this.layout_data, me: this}))
			.appendTo(this.page.main);
			frappe.call('tech.tech_projects.page.exam_page.exam.fetch_questions', {
				name: this.exam.name,
			}).then(r => {
				let diff = r.message;
				$(frappe.render_template("test2", {	
					data: diff, me: this}))
					.appendTo(this.page.main);
	
			});
		
		
	},
	
	
	save: function(accept, table_names){
		var me = this
		if( ! me.full_name.value){
			frappe.throw("enter full name")
		}
		if( ! me.e_mail.value){
			frappe.throw("enter e-mail id")
		}
		frappe.call('tech.tech_projects.page.exam_page.exam.extact_class_id', {
			rc_name: me.exam.name,
		}).then(r => {
			let data = r.message;
			var exam_dict = [];
			for (var x=0; x<data.length;x++){
				var user_answer = document.getElementById("NameAlex").value;
				var get_answer = false
				var question = data[x].question_id
				var answer = data[x].answer
				var field =  document.getElementById(data[x].answer_id)
				var user_answer
				if(field.type == "radio"){
					var radio_value = document.getElementById(data[x].answer_id).checked;
					if(radio_value == true && get_answer == false){
						user_answer = document.getElementById(data[x].user_ans).textContent;
						get_answer = true
						exam_dict.push({
							"question": question,
							"answer": answer,
							"user_ans":user_answer,
							"question_type": data[x].question_type

						})
					}
					if(radio_value == false && get_answer == false){
						user_answer = document.getElementById(data[x].answer_id).textContent;
					}
				}
				else{
					 user_answer = document.getElementById(data[x].answer_id).value;
					
					 exam_dict.push({
						"question": question,
						"answer": answer,
						"user_ans":user_answer,
						"question_type": data[x].question_type
					})
					
				}	
			
			}
			frappe.call("tech.tech_projects.page.exam_page.exam.update_exam_result",{
				user_name: this.full_name.value,
				e_mail: this.e_mail.value,
				exam_title: me.exam.exam_title,
				exam_start_time: this.exam_start_time.value,
				exam_end_time:  this.exam_start_time.value,
				exam_rcord: exam_dict
			})
			
		});
		
	}
});
