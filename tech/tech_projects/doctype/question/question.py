# Copyright (c) 2022, alex and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Question(Document):
	
	def validate(self):
		if self.question_type == "MCQ":
			answer = False
			for row in self.get("msq_questions"):
				if row.answer == 1:
					answer = True
			if answer == False:
				frappe.throw("atleat one answer is required")
