import random

def generate_perm(num):
    perm = set()
    while len(perm) < num:
        perm.add(str(random.randint(100000, 9999999)))
    return perm

def generate_courseId():
    return "random course id"

def generate_enrollCode():
    return "random enroll code"

def generate_gradingOptionCode():
    random_gradingOption = random.random()
    if random_gradingOption < 0.25:
        return "P/NP"
    else:
        return "L"

def generate_unitsAttempted():
    random_units = random.random()
    if random_units < 0.1:
        return 3
    elif random_units < 0.2:
        return 5
    else:
        return 4

def generate_courseTitle():
    subject_list = ["CMPSC", "MATH", "PHYS"]
    subject = subject_list[random.randint(0, len(subject_list) - 1)]
    prefix = str(random.randint(1, 199))
    suffix = ""
    p = random.random()
    if p < 0.1:
        suffix = "C"
    elif p < 0.25:
        suffix = "B"
    elif p < 0.4:
        suffix = "A"
    return subject + " " + prefix + suffix

def generate_session(quarter):
    if quarter[-1] != "M":
        return "Session number only for summer quarter"
    else:
        p = random.random()
        if p < 0.2:
            return "C"
        elif p < 0.6:
            return "B"
        else:
            return "A"

def generate_repeatTypeCode():
    return "random repeat type code"

def generate_section():
    return "random section"

def generate_instructionTypeCode():
    p = random.random()
    if p < 0.5:
        return "Dis"
    else:
        return "Lec"

def generate_days():
    day_list = ["M W", "T R", "M W F"]
    return day_list[random.randint(0, 2)]

time_dict1 = {
    "08:00" : "09:15",
    "09:30" : "10:45",
    "11:00" : "12:15",
    "12:30" : "01:45",
    "02:00" : "03:15",
    "03:30" : "04:45",
    "05:00" : "06:15",
    "06:30" : "07:45",
}

time_dict2 = {
    "08:00" : "08:50",
    "09:00" : "09:50",
    "10:00" : "10:50",
    "11:00" : "11:50",
    "12:00" : "12:50",
    "01:00" : "01:50",
    "02:00" : "02:50",
    "03:00" : "03:50",
    "04:00" : "04:50",
    "05:00" : "05:50",
    "06:00" : "06:50",
    "07:00" : "07:50",
}

def generate_lectureTime(days):
    if days == "M W" or days == "T R":
        begin = random.choice(list(time_dict1.keys()))
        end = time_dict1[begin]
        return begin, end
    else:
        begin = random.choice(list(time_dict2.keys()))
        end = time_dict2[begin]
        return begin, end

def generate_buildingRoom():
    building = random.choice(["ILP", "LSB", "HFH", "HSSB", "TD-W", "CHEM", "PHELP", "GIRV", "NH", "SH", "BRDA", "BUCHN"])
    room = str(random.randint(1001, 4999))
    return building + " " + room

def generate_profName():
    return "random professor name"

def generate_functionCode():
    return "random function code"

def generate_data(num):
    path = "database.json"
    perm = generate_perm(num)
    quarter = ["2023F", "2024W", "2024S", "2024M", "2024F", "2025W"]
    with open("valid_perm.txt", 'w', encoding='utf-8') as file:
        for p in perm:
            file.write(f"{p}\n")
    with open(path, 'w', encoding='utf-8') as file:
        file.write("{\n")
        t = 0
        for p in perm:
            t += 1
            file.write(f"\t\"{p}\": {{\n")
            for q in quarter:
                file.write(f"\t\t\"{q}\": [{{\n")
                n_course = random.randint(3, 5)
                for i in range(n_course):
                    file.write(f"\t\t\t\"courseId\": \"{generate_courseId()}\",\n")
                    file.write(f"\t\t\t\"quarter\": \"{q}\",\n")
                    file.write(f"\t\t\t\"enrollCode\": \"{generate_enrollCode()}\",\n")
                    file.write(f"\t\t\t\"gradingOptionCode\": \"{generate_gradingOptionCode()}\",\n")
                    file.write(f"\t\t\t\"unitsAttempted\": \"{generate_unitsAttempted()}\",\n")
                    file.write(f"\t\t\t\"courseTitle\": \"{generate_courseTitle()}\",\n")
                    file.write(f"\t\t\t\"session\": \"{generate_session(q)}\",\n")
                    file.write(f"\t\t\t\"repeatTypeCode\": \"{generate_repeatTypeCode()}\",\n")
                    file.write(f"\t\t\t\"timeLocations\": [{{\n")
                    file.write(f"\t\t\t\t\"section\": \"{generate_section()}\",\n")
                    file.write(f"\t\t\t\t\"instructionTypeCode\": \"{generate_instructionTypeCode()}\",\n")
                    days = generate_days()
                    beginTime, endTime = generate_lectureTime(days)
                    file.write(f"\t\t\t\t\"days\": \"{days}\",\n")
                    file.write(f"\t\t\t\t\"beginTime\": \"{beginTime}\",\n")
                    file.write(f"\t\t\t\t\"endTime\": \"{endTime}\",\n")
                    file.write(f"\t\t\t\t\"buildingRoom\": \"{generate_buildingRoom()}\",\n")
                    file.write(f"\t\t\t\t\"instructors\": [{{\n")
                    file.write(f"\t\t\t\t\t\"name\": \"{generate_profName()}\",\n")
                    file.write(f"\t\t\t\t\t\"functionCode\": \"{generate_functionCode()}\"\n")
                    file.write(f"\t\t\t\t}}]\n")
                    file.write(f"\t\t\t}}]\n")
                    if i != n_course - 1:
                        file.write("\t\t\t}, {\n")
                file.write(f"\t\t}}]")
                if q != quarter[-1]:
                    file.write(",")
                file.write("\n")
            if t != num:
                file.write("\t},\n")
            else:
                file.write("\t}\n")
        file.write("}\n")


generate_data(1000)