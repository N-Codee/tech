from collections import defaultdict
import frappe
import json



@frappe.whitelist()
def fetch_questions(name):
    ls = []
    question_rc = frappe.db.sql(""" select questions from `tabExam Questions` where parent = %s """,(name),as_dict=1)
    for record in question_rc:
        question_type = frappe.db.get_value("Question",record.questions,"question_type")
        if question_type == "MCQ":
            data = frappe.db.sql(""" select msq.name, msq.idx, msq.question ans_opt, msq.answer,msq.parent, q.question_type, q.question from `tabMSQ Questions` msq
                                            left join `tabQuestion` q on msq.parent = q.name
                                             where msq.parent = %s """,(record.questions),as_dict=1)
            ls.append(data)
         
        if question_type == "One Word":
            data = frappe.db.sql(""" select question_type,question, one_word_ans from `tabQuestion` where name = %s """,(record.questions),as_dict=1)
            ls.append(data)
    return ls
@frappe.whitelist()
def extact_class_id(rc_name):
    question_id = []
    data = fetch_questions(rc_name)
    for row in data:
        for i in row:
            if i.question_type == "MCQ":
                question_id.append({
                    "question_id": i.question,
                    "answer_id": i.ans_opt + str(i.idx),
                    "user_ans": i.question + i.ans_opt + str(i.idx),
                    "answer":frappe.db.get_value("MSQ Questions",{"parent":i.parent,"answer":1},"question"),
                    "question_type": i.question_type
                })
            if i.question_type == "One Word":
                question_id.append({
                    "question_id": i.question,
                    "answer_id":i.question +i.one_word_ans,
                    "answer": i.one_word_ans,
                    "question_type": i.question_type
                }) 
    return question_id
    
@frappe.whitelist()
def update_exam_result(user_name, e_mail, exam_title, exam_start_time, exam_end_time, exam_doc, exam_rcord):
    exam_rcord = json.loads(exam_rcord)
    doc = frappe.new_doc("Exam Records")
    doc.user_name = user_name
    doc.user_mail_id = e_mail
    doc.exam_title = exam_title
    doc.exam_start_time = exam_start_time
    doc.exam_end_time = exam_end_time
    for row in exam_rcord:
        if row["answer"] == row["user_ans"]:
            mark = 1
        else:
            mark = 0
        doc.append('exam_records_details', {
            'question': row["question"],
            "type_of_question":row["question_type"],
            "answer": row["answer"],
            "user_answer":row["user_ans"],
            "mark": mark
        })

    doc.save()
    # frappe.throw(str(doc.total_mark))
    examdoc = frappe.get_doc("Exam",exam_doc)
    examdoc.attended_count += 1
    examdoc.save()
    
    frappe.msgprint("Exam Saved Sucessfully ",alert=True, indicator="green")
    return doc.total_mark
