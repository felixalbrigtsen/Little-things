#Felix Albrigtsen 2019
#School project demo. WINDOWS ONLY.
#Try signing in with un:pw combinations:
# - user1:user1
# - user2:user2
# - admin1:admin1
#Python version of the library management software project


import json
import os
import getpass
import hashlib
import time
import datetime

currentUser = None

screenWidth = 70
screenHeight = 22

database_directory = "databases/"


#Database entry templates (As python dictionaries)
db_template_userLoan = {
    "Item-id": 0,
    "Copy-id": 0
}
db_template_loan = {
    "User": "",
    "Copy-id": 0,
    "Loaned": "",
}
db_template_user = {
    "Username": "",
    "Administrator": False,
    "Firstname": "",
    "Lastname": "",
    "Password": "",
    "Loans": []
}

db_template_invItem = {
    "Title": "",
    "Author": "",
    "Year": 0,
    "Description": "",
    "Media": "",
    "Item-id": 0,
    "Amount": 0,
    "Amount-in-stock": 0,
    "Full": True,
    "Empty": False,
    "Loaned": []
}

#Load files into memory:
#No changes are done directly into the files. Only one session can be opened at once.
#(Files are closed and saved in the exitProgram-function. If the program crashes/fails, changes are not saved.)
readFile = open((database_directory + "accounts.json"), "r")
accounts_db = readFile.read()
readFile.close()

readFile = open((database_directory + "inventory.json"), "r")
inventory_db = readFile.read()
readFile.close()

#Convert all JSON "databases" to python Dict objects
accounts_db = json.loads(accounts_db)
inventory_db = json.loads(inventory_db)

os.system("mode con: cols={} lines={}".format(screenWidth, screenHeight))

class UserObject: #User class, used to store user properties and to do user actions.
    def __init__(self, db_object):
        self.Username = db_object["Username"]
        self.Administrator = db_object["Administrator"]
        self.Firstname = db_object["Firstname"]
        self.Lastname = db_object["Lastname"]

        self.userIndex = [x["Username"] for x in accounts_db["users"]].index(self.Username)


class LibraryObject: #Library class, handles loans, returns, and admin management functions
    def updateStatus(self, itemId): #Update Amount-in-stock, Full and Empty variables in the database
        itemIndex = [x["Item-id"] for x in inventory_db["items"]].index(itemId)
        item = inventory_db["items"][itemIndex]
        totalCount = item["Amount"]
        loaned = item["Loaned"]
        stockCount = totalCount - len(loaned) #Count items that are loaned out, subtract them from the stock total

        
        inventory_db["items"][itemIndex]["Amount-in-stock"] = stockCount

        inventory_db["items"][itemIndex]["Full"] = (stockCount == totalCount)

        inventory_db["items"][itemIndex]["Empty"] = (stockCount == 0)

    def listInStock(self): #List all items in inventory that can be loaned
        availableItems = [x for x in inventory_db["items"] if not x["Empty"]]
        return availableItems
    
    def loanItem(self, itemId):
        #Function gets what copies are available, and loans one. Returns the copyId
        #Return codes:
        #-1: Error / Not available
        #Anything else: copyId of item loaned.

        itemIndex = [x["Item-id"] for x in inventory_db["items"]].index(itemId)

        #List of "loan"-objects of the item
        loanedCopies = [x["Copy-id"] for x in (inventory_db["items"][itemIndex]["Loaned"])]
        #Number of total copies, both loaned out and in stock
        copyAmount = inventory_db["items"][itemIndex]["Amount"]

        copies = [y for y in range(copyAmount) if not (y in loanedCopies)] #Create list containing every copy that isn't loaned out already
        copyId = copies[0] #Select the first available copy

        loanEntry = db_template_loan
        loanEntry["User"] = currentUser.Username
        loanEntry["Copy-id"] = copyId
        loanEntry["Loaned"] = datetime.datetime.now().strftime("%A, %d. %B %Y %I:%M%p")

        loan_user_entry = db_template_userLoan
        loan_user_entry["Item-id"] = itemId
        loan_user_entry["Copy-id"] = copyId
        
        #IMPORTANT: Use .copy(), or each new item will update as the loanEntry is changed
        accounts_db["users"][currentUser.userIndex]["Loans"].append(loan_user_entry.copy())
        inventory_db["items"][itemIndex]["Loaned"].append(loanEntry.copy())

        self.updateStatus(itemId) #Recount, change the "Empty" and "Full" attributes

    def returnItem(self, itemId, copyId, uname=""):
        itemIndex = [x["Item-id"] for x in inventory_db["items"]].index(itemId)
        copyIndex = [x["Copy-id"] for x in inventory_db["items"][itemIndex]["Loaned"]].index(copyId)
        
        if uname == "":
            userIndex = currentUser.userIndex
        else:
            userIndex = [x["Username"] for x in accounts_db["users"]].index(uname)
        
        
        allUserLoans = accounts_db["users"][userIndex]["Loans"]

        #Make a list of lists: where each sublist is formatted [<loanObject>, <loans index in allUserLoans>]
        loan = [x for x in allUserLoans if ((x["Item-id"] == itemId) and (x["Copy-id"] == copyId))][0]
        userLoanIndex = allUserLoans.index(loan)

        #Remove listing from inventory
        del inventory_db["items"][itemIndex]["Loaned"][copyIndex]
        
        #Remove listing from accounts
        del accounts_db["users"][userIndex]["Loans"][userLoanIndex]

        self.updateStatus(itemId)
        return 0

    def addItem(self, properties): #Takes a list of properties of the new item as input, adds it to the database
        #"Properties" structure: [Title, Author, Year, Description, Media, Amount]
        newItemEntry = db_template_invItem
        newItemEntry["Title"] = properties[0]
        newItemEntry["Author"] = properties[1]
        newItemEntry["Year"] = properties[2]
        newItemEntry["Description"] = properties[3]
        newItemEntry["Media"] = properties[4]
        newItemEntry["Amount"] = properties[5]
        newItemEntry["Amount-in-stock"] = properties[5]

        #Find the first available item-id
        newItemId = 0
        while newItemId in [x["Item-id"] for x in inventory_db["items"]]:
            newItemId += 1
        
        newItemEntry["Item-id"] = newItemId


        inventory_db["items"].append(newItemEntry.copy())

    def removeItem(self, itemId): #Remove item from inventory database. 
        #If this function is called, we already know that no copies are loaned out, and that the removal is valid
        itemIndex = [x["Item-id"] for x in inventory_db["items"]].index(itemId)

        del inventory_db["items"][itemIndex]
        

class AccountManagerObject: #Class for the object that adds/removes/edits user accounts
    #The database is not copied, and all changes are immidiate

    def addUser(self, properties): #Takes a list of properties as input, then adds user to database
        #Properties structure: [Username, Firstname, Lastname, Administrator, Password]
        newUserDict = db_template_user
        if properties[0] in [x["Username"] for x in accounts_db["users"]]:
            #Username taken.
            return 1

        newUserDict["Username"] = properties[0]
        newUserDict["Firstname"] = properties[1]
        newUserDict["Lastname"] = properties[2]
        newUserDict["Administrator"] = properties[3]
        newUserDict["Password"] = properties[4]

        accounts_db["users"].append(newUserDict.copy())



        #Return codes:
        #0: OK!
        #1: Username taken

        return 0



    def removeUser(self, uname): #Removes a user from the database. (Only if it has no active loans.)
        #Return codes:
        #0: OK!
        #1: User has active loans
        #2: User does not exist
        #3: Cannot delete itself

        if uname == currentUser.Username:
            return 3 #Deleting itself is not allowed.

        if uname in [x["Username"] for x in accounts_db["users"]]:
            userIndex = [x["Username"] for x in accounts_db["users"]].index(uname)
        else:
            return 2

        if len(accounts_db["users"][userIndex]["Loans"]) == 0:
            del accounts_db["users"][userIndex]
            return 0
        else:
            return 1

    def changePassword(self, username, newPassword):
        userIndex = [x["Username"] for x in accounts_db["users"]].index(username)
        accounts_db["users"][userIndex]["Password"] = newPassword


def displayMenu(options, header="", footer="", leftPadding=3, enterLeave=False):
    print "\033[2J" 
    print ("#" * screenWidth)
    print (" " * leftPadding),
    print header #Optional text before list of options

    for i in range(len(options)):
        print ("\n" + (" "*leftPadding) + str(i+1) + ". " + options[i])
    

    print (" " * leftPadding),
    print footer #Optional text after list of options
    print ("#" * screenWidth) + "\n"

    #Take input, retry if not an integer or out of range
    selected = 0
    while selected == 0:
        print "   ",
        selected = raw_input(":")

        if enterLeave and selected == "":
            selected = 1 #Choose the first option if "enterLeave" is set

        try: #Check that input is an integer
            selected = int(selected)
        except ValueError:
            selected = 0

        if not (0 < selected and selected <= len(options)): #Check that input is within range
            selected = 0

        if selected == 0:
            print("\033[2A   Invalid input...") #If either of the earlier tests fail, retry
    
    return (selected-1)


def login(uname, pwordHash):
    global currentUser

    if uname not in  [x["Username"] for x in accounts_db["users"]]:
        #User does not exist
        return False

    #If the function is still running here, we know the user exists
    userIndex =  [x["Username"] for x in accounts_db["users"]].index(uname)

    userDBObject = accounts_db["users"][userIndex]

    if pwordHash == userDBObject["Password"]:
        currentUser = UserObject(userDBObject)
        return True
    else:
        return False
    
def userMenu():
    #Handle main menu for normal users/customers
    while True: #Keep looping when the action is complete. The exit function will stop this.
        menuItems = [
            "View your loans",
            "View item description",
            "Loan an item",
            "Return an item",
            "Change password",
            "Revert changes and exit",
            "Save and exit",
        ]

        selection = displayMenu(menuItems, header="  --- Main Menu ---  ", leftPadding=20)
        
        if (selection == 0):
            #List loaned items
            #Display as a menu, any button press will show the main menu again.
            loans = accounts_db["users"][currentUser.userIndex]["Loans"]
        
            
            if len(loans) > 0:
                #Format of the loan string should be "Title  Timestamp"
                loanStringList = []

                for loan in loans:
                    itemIndex = [x["Item-id"] for x in inventory_db["items"]].index(loan["Item-id"])
                    title = inventory_db["items"][itemIndex]["Title"]

                    copyIndex = [x["Copy-id"] for x in inventory_db["items"][itemIndex]["Loaned"]].index(loan["Copy-id"])
                    timestamp = inventory_db["items"][itemIndex]["Loaned"][copyIndex]["Loaned"]

                    loanStringList.append(title + " | " + timestamp)
                    #loanStringList.append(title)
                
                #Display the loans in a list. 
                displayMenu(loanStringList, header=" Your active loans: Title and date/time loaned \n", footer="\n   Press Enter to continue.", enterLeave=True)    
            else:
                #No loaned items.
                displayMenu(["You have no currently active loans. \n       Press enter to return to menu."], enterLeave=True)


        elif (selection == 1):
            #View item information
            #List all items, then display info about the selected one.
            allItems = libraryManager.listInStock()
            allItemTitles = [x["Title"] for x in allItems]

            allItemTitles.append("Cancel")

            itemSelection = displayMenu(allItemTitles, header="All items:")

            if itemSelection != len(allItems):
                item = allItems[itemSelection] 

                outputList = []
                outputList.append("Title: " + item["Title"])
                outputList.append("Format: " + item["Media"])
                outputList.append("Description: " + item["Description"])

                if item["Media"] == "Movie":
                    outputList.append("Director: " + item["Author"])
                else:
                    outputList.append("Author: " + item["Author"])
            
                outputList.append("Year: " + str(item["Year"]))
                outputList.append("In stock: " + str(item["Amount-in-stock"]))

                displayMenu(outputList, header="Item details: ", footer="\nPress enter to continue.", enterLeave=True)




        elif (selection == 2):
            #Display all items currently in stock
            #Display as a menu, pressing enter will show the main menu again.
            #Then allow items to be loaned

            #Get the item-id of all the items in stock
            allItems = libraryManager.listInStock()
            allItems = [x["Item-id"] for x in allItems]

            allItemIndexes = [[x["Item-id"] for x in inventory_db["items"]].index(y) for y in allItems]

            itemStringList = []
            #Format each item as "Title | Author/director | Copies in stock"
            for itemIndex in allItemIndexes:
                itemTitle = inventory_db["items"][itemIndex]["Title"]
                itemAuthor = inventory_db["items"][itemIndex]["Author"]
                itemStockCount = inventory_db["items"][itemIndex]["Amount-in-stock"]

                itemStringList.append(itemTitle + " | " + itemAuthor + " | " + str(itemStockCount))

            #Add "Cancel" as the last element
            itemStringList.append("Cancel")

            itemSelection = displayMenu(itemStringList, header="   All stocked items \n   Title | Author/Director | Amount in stock ")
            if (itemSelection != len(allItems)):
                #As long as "Cancel" is not selected
                libraryManager.loanItem(allItems[itemSelection]) #Loan item(by id), add it to all appropriate databases.
        


        elif (selection == 3):
            #Return item
            #Display all active loans, select what item to return

            loans = accounts_db["users"][currentUser.userIndex]["Loans"]
    
            if len(loans) > 0:
                #Format of the loan string should be "Title  Timestamp"
                loanStringList = []
                
                itemInfoList = [] #List of each item, formatted as [<itemId>, <copyId>]

                for loan in loans:
                    itemIndex = [x["Item-id"] for x in inventory_db["items"]].index(loan["Item-id"])
                    title = inventory_db["items"][itemIndex]["Title"]

                    copyIndex = [x["Copy-id"] for x in inventory_db["items"][itemIndex]["Loaned"]].index(loan["Copy-id"])
                    timestamp = inventory_db["items"][itemIndex]["Loaned"][copyIndex]["Loaned"]

                    itemInfoList.append([loan["Item-id"], loan["Copy-id"]])
                    loanStringList.append(title + " | " + timestamp)
                
                loanStringList.append("Cancel")
                #Display the loans in a list. 
                itemSelection = displayMenu(loanStringList, header=" Your active loans: Title and date/time loaned \n", footer="\n   Select the item you want to return.")    
            
                if itemSelection != len(loans):
                    #If "cancel" is not selected
                    selectedItemId = itemInfoList[itemSelection][0]
                    selectedCopyId = itemInfoList[itemSelection][1]
                    libraryManager.returnItem(selectedItemId, selectedCopyId) #Return selected item. Removes from all appropriate databases

            else:
                #No loaned items.
                displayMenu(["You have no currently active loans. \n       Press enter to return to menu."], enterLeave=True)
            
        elif (selection == 4):
            #Change password.

            print "\033[2J" 
            print "\n"*4 + "#"*screenWidth
            print "\n"*9 + "#"*screenWidth
            print "\033[8;7H",
            print "Change password  -  Leave blank to cancel change"

            print "\033[10;20H",
            password1 = getpass.getpass()
            print "\033[11;10H",
            print "Re-enter ",
            password2 = getpass.getpass()

            if password1 != password2:
                #Passwords do not match
                print "\033[13;7H",
                print "The passwords entered do not match. Cancelling."
                time.sleep(3)

            else:
                if password1 != "": #If password is not blank
                    #Hash the password and change it in the DB
                    newPasswordHash = (hashlib.sha1(password1.encode())).hexdigest() #Hash
                    accountManager.changePassword(currentUser.Username, newPasswordHash)

                    print "\033[14;5H",
                    print "Password changed successfully! Remember to save when quitting."
                    time.sleep(3)

            
        elif (selection == 5):
            #Exit without saving
            exitProgram(saveState=False)
        
        elif (selection == 6):
            #Save and exit
            exitProgram()

        else:
            #Code should be unreadable
            print "unimplemented"
            time.sleep(2)

        #The displayMenu-function should ensure that the returned output will always be within range.


def adminMenu():
    while True:
        menuItems = [
            "List users",
            "Add user",
            "Remove user",
            "Add item",
            "Remove item",
            "Revert changes and exit",
            "Save and exit"
        ]
        selection = displayMenu(menuItems, header=" --- Main Menu ---  ", leftPadding=20)

        if (selection) == 0:
            #List all users
            users = accounts_db["users"]
            userStringList = []
            for i in users:
                userType = ("Administrator" if i["Administrator"] else "User")
                userStringList.append(i["Username"] + " | " + i["Firstname"] + " " + i["Lastname"] + " | " + userType + " | " + str(len(i["Loans"])))
            
            selectedUser = displayMenu(userStringList, header="All users:\n    Username | Name | Account type | Loans \n    Select a user to see their loans")

            itemDisplayList = []

            user = users[selectedUser]

            for i in user["Loans"]:
                itemIndex = [x["Item-id"] for x in inventory_db["items"]].index(i["Item-id"])
                loanIndex = [x["Copy-id"] for x in inventory_db["items"][itemIndex]["Loaned"]].index(i["Copy-id"])
                loanInstance = inventory_db["items"][itemIndex]["Loaned"][loanIndex]

                itemDisplayList.append(inventory_db["items"][itemIndex]["Title"] + " | Copy " + str(i["Copy-id"]) + " | " + loanInstance["Loaned"])
            
            itemDisplayList.append("Cancel")

            selectedItem = displayMenu(itemDisplayList, header="Force Return Items")

            if selectedItem != len(user["Loans"]):
                #As long as "Cancel" isn't connected; return item
                libraryManager.returnItem(user["Loans"][selectedItem]["Item-id"], user["Loans"][selectedItem]["Copy-id"], uname=user["Username"])

        elif (selection == 1):
            #Add user
            #Properties structure: [Username, Firstname, Lastname, Administrator, Password]

            print "\033[2J"
            print "\033[4;0H"
            print "#"*screenWidth
            print "\033[17;0H"
            print "#"*screenWidth

            print "\033[6;18H",
            print "Register a new user. \n                  Leave username blank to cancel"
            print "\033[9;19H",
            new_usr_Username = raw_input("Username: ")
            if (new_usr_Username == ""):
                continue #Cancel
            print "\033[10;17H",
            new_usr_Firstname = raw_input("First name: ")
            print "\033[11;18H",
            new_usr_Lastname = raw_input("Last name: ")
            print "\033[12;2H",
            new_usr_Type = raw_input("(U)ser or (A)dministrator: ")
            print "\033[13;20H",
            new_usr_password1 = getpass.getpass()
            print "\033[14;11HRe-enter ",
            new_usr_password2 = getpass.getpass()


            print "\033[16;12H",

            
            if new_usr_Username in [x["Username"] for x in accounts_db["users"]]:
                print "Error; Username is already taken."
                time.sleep(3)
                continue
            if new_usr_Firstname == "":
                print "Error; Firstname cannot be empty"
                time.sleep(3)
                continue
            if new_usr_Lastname == "":
                print "Error; Lastname cannot be empty"
                time.sleep(3)
                continue
            if new_usr_password1 == "":
                print "Error; Password cannot be empty"
                time.sleep(3)
                continue
            if new_usr_Type not in ["u", "a", "U", "A"]:
                print "Error; User type must be either 'U' or 'A'"
                time.sleep(3)
                continue
            if new_usr_password1 != new_usr_password2:
                print "Error; Passwords do not match"
                time.sleep(3)
                continue
            
            new_usr_Password = (hashlib.sha1(new_usr_password1.encode())).hexdigest() #Hash password

            typeIndex = ["a", "u"].index(new_usr_Type.lower())
            new_usr_Administrator = (typeIndex == 0) #True or False

            accountManager.addUser([new_usr_Username, new_usr_Firstname, new_usr_Lastname, new_usr_Administrator, new_usr_Password])

            

        elif (selection == 2):
            #Remove a user
            users = accounts_db["users"]
            userStringList = []
            for i in users:
                userType = ("Administrator" if i["Administrator"] else "User")
                userStringList.append(i["Username"] + " | " + i["Firstname"] + " " + i["Lastname"] + " | " + userType)
            userStringList.append("Cancel")
            
            selectedUser = displayMenu(userStringList, header="Remove user:")

            if selectedUser != len(users):
                #As long as "Cancel" isn't selected
                returnCode = accountManager.removeUser(users[selectedUser]["Username"]) #Remove user

                #Display message appropriate to return code
                if returnCode == 0:
                    print "\n      User has been removed."
                elif returnCode == 1:
                    print "\n      Error; User has active loans. Return items before deleting."
                elif returnCode == 3:
                    print "\n      Error; You cannot delete yourself."
                time.sleep(3)

        elif (selection == 3):
            #Add new item
            #"Properties" structure: [Title, Author, Year, Description, Media, Amount]
            
            print "\033[2J"
            print "\033[4;0H"
            print "#"*screenWidth
            print "\033[17;0H"
            print "#"*screenWidth

            print "\033[6;18H",
            print "Add a new item. \n                  Leave title blank to cancel"

            print "\033[9;22H",
            item_title = raw_input("Title: ")

            if item_title == "":
                #Cancel if title is blank.
                continue

            print "\033[10;10H",
            item_media = raw_input("(B)ook or (M)ovie: ")

            if item_media in ["m", "M"]:
                #Movie
                print "\033[11;19H",
                item_author = raw_input("Director: ")
            else:
                #Book / unknown
                print "\033[11;21H",
                item_author = raw_input("Author: ")

            print "\033[12;23H",
            item_year = raw_input("Year: ")

            print "\033[13;16H",
            item_description = raw_input("Description: ")

            print "\033[14;11H",
            item_amount = raw_input("Number of copies: ")


            print "\033[16;12H",

            try:
                item_media = item_media.lower()
            except ValueError:
                print "Error; Media must be a letter"
                time.sleep(3)
                continue
            
            if item_media not in ["b", "m"]:
                print "Error; Media must be either B or M"
                time.sleep(3)
                continue
            
            try:
                item_year = int(item_year)
            except ValueError:
                print "Error; Year must be a number"
                time.sleep(3)
                continue
            
            if item_year > 2100 or item_year < 1000:
                print "Error; Year out of range"
                time.sleep(3)
                continue
                
            try:
                item_amount = int(item_amount)
            except ValueError:
                print "Error; Amount of copies must be a number"
                time.sleep(3)
                continue
        
            if item_amount < 0 or item_amount > 100:
                print "Error; Number of copies not in range"
                time.sleep(3)
                continue

            if item_author == "":
                print "Error; Author/Director is required"
                time.sleep(3)
                continue

            try:
                item_description = str(item_description)
            except ValueError:
                print "Error; Description must be a string"
                time.sleep(3)
                continue

            item_description.replace("\\n", "\n") #Fix newlines, the linebreak character will be broken

            item_media = ("Book" if item_media == "b" else "Movie") #Set to either "Book" or "Movie"

            #Input is now sanitized and correct Type. Add to database
            itemProperties = [item_title, item_author, item_year, item_description, item_media, item_amount]
            libraryManager.addItem(itemProperties)

        elif (selection == 4):
            #Remove item
            #List all items
            allItems = inventory_db["items"]
            allItems = [x["Item-id"] for x in allItems]

            allItemIndexes = [[x["Item-id"] for x in inventory_db["items"]].index(y) for y in allItems]

            itemStringList = []
            #Format each item as "Title | Author/director | Copies in stock"
            for itemIndex in allItemIndexes:
                itemTitle = inventory_db["items"][itemIndex]["Title"]
                itemAuthor = inventory_db["items"][itemIndex]["Author"]
                itemStockStatus = "Partly stocked"
                """
                if inventory_db["items"][itemIndex]["Empty"]:
                    itemStockStatus = "Empty"
                if inventory_db["items"][itemIndex]["Full"]:
                    itemStockStatus = "Fully stocked"
                """
                itemStockStatus = str(inventory_db["items"][itemIndex]["Amount-in-stock"]) + " in stock of " + str(inventory_db["items"][itemIndex]["Amount"]) + " total."

                itemStringList.append(itemTitle + " | " + itemAuthor + " | " + itemStockStatus)

            #Add "Cancel" as the last element
            itemStringList.append("Cancel")

            itemSelection = displayMenu(itemStringList, header="   Remove item \n   Title | Author/Director | Stock status ")
            if (itemSelection != len(allItems)):
                #As long as "Cancel" is not selected
            
                itemIndex = allItemIndexes[itemSelection]
                if not inventory_db["items"][itemIndex]["Full"]:
                    print "\n\n   Error; Item is not fully stocked. Please return all copies first."
                    time.sleep(3)
                    continue
                
                libraryManager.removeItem(inventory_db["items"][itemIndex]["Item-id"]) #Remove the item

        elif (selection == 5):
            #Exit without saving
            exitProgram(saveState=False)
        
        elif (selection == 6):
            #Save and exit
            exitProgram()
def loginForm():
    loggedIn = False
    while not loggedIn:

        #ANSI Escape codes: ESC[2J = Clear screen and reset cursor, ESC[y;xH = Set cursor position

        print "\033[2J" 
        print "\n"*4 + "#"*screenWidth
        print "\n"*7 + "#"*screenWidth
        print "\033[9;12H",
        username = raw_input("Username: ")
        print "\033[10;13H",
        password = getpass.getpass()
        password = (hashlib.sha1(password.encode())).hexdigest() #Hash password
        

        print "\033[18;12H",
        loggedIn = login(username, password)
        if not loggedIn and username not in [x["Username"] for x in accounts_db["users"]]:
            print("User does not exist.")
        elif not loggedIn: #If username exists, but not logged in
            print("Unknown error or invalid password")


        if loggedIn:
            print("Login Successful! Welcome, {} {}".format(currentUser.Firstname, currentUser.Lastname))
        time.sleep(2)

        
        if loggedIn:
            if currentUser.Administrator:
                adminMenu()
            else:
                userMenu()

def exitProgram(saveState=True):

    if saveState: #If changes should be changed, do so.
        writeFile = open((database_directory + "accounts.json"), "w")
        writeFile.write(json.dumps(accounts_db))
        writeFile.close()

        writeFile = open((database_directory + "inventory.json"), "w")
        writeFile.write(json.dumps(inventory_db))
        writeFile.close()
    exit()



accountManager = AccountManagerObject()
libraryManager = LibraryObject()

loginForm()
