#Felix Albrigtsen 2019
#School project demo. WINDOWS ONLY
#Mostly Object oriented implementation of a binary search tree in python
#Create a new tree, recursively insert new nodes, search for a value, list all nodes in order and remove nodes


import os
import math
screenWidth = 80
screenHeight = 30

widthspacing=60
lineLeftOffset = 4

os.system("mode con: cols={} lines={}".format(screenWidth, screenHeight)) #Set screen dimensions
print "\033[2J" #Clear screen

class Node:
    def __init__(self, _value):
        self.value = _value #Value or key
        #self.data = data #Additional data, not structured by the tree

        self.left = None
        self.right = None
    
    def insert(self, value):
        #Insert smaller values to the left and larger(or equal) values to the right.
        #Recursive function

        if value < self.value:
            if self.left: #If the left child exists, recursive add the new element to that child
                self.left.insert(value) #Recursive add
            else: #If the left child does not already exist, set the new node as this nodes left child
                self.left = Node(value)

        if value >= self.value: #We choose to also put equal values to the right
            if self.right:
                self.right.insert(value) #Recursive add
            else:
                self.right = Node(value) #Set right child of current node to the new value

def createTree(inList):
    #Returns a new tree of all elements in "inList"
    newRoot = Node(inList[0])
    for i in range(1, len(inList)):
        newRoot.insert(inList[i])
    return newRoot


def inorder(rootNode):
    #Returns a list of all the nodes in the given tree
    nodes = []
    if rootNode:
        nodes += inorder(rootNode.left)
        nodes += [rootNode.value]
        nodes += inorder(rootNode.right)
    return nodes

def findPath(rootNode, query):
    #Searches for the node where value=query
    #The function calls itself recursively and prints every step
    if query == rootNode.value:
        print "Found " + str(query)

    if query > rootNode.value:
        print("Right -> {}".format(rootNode.right.value))
        findPath(rootNode.right, query)
    if query < rootNode.value:
        #path.append("Left -> {}".format(findPath(rootNode.left, query)))
        print("Left -> {}".format(rootNode.left.value))
        findPath(rootNode.left, query)

def findSmallest(rootNode):
    #Returns the smallest node in a tree
    smallest = rootNode
    while smallest.left != None:
        smallest = rootNode
        rootNode = rootNode.left
    return smallest

def deleteKey(rootNode, value):
    #Recursively remove the element with the given value

    if rootNode == None:  #Return if the tree is empty
        return rootNode

    #Otherwise, recursively call the delete-function
    if value < rootNode.value: 
        rootNode.left = deleteKey(rootNode.left, value)
    elif value > rootNode.value:
        rootNode.right = deleteKey(rootNode.right, value)

    #If the value is EQUAL to the rootNodes value, this is the element to be deleted
    else:
        #If the tree has no left child, it means that it either has no children or just a right child
        if rootNode.left == None:
            return rootNode.right #The tree is now set to the right branch, although it could be empty
        elif rootNode.right == None:
            #If the left child exist and the right does not; set the tree equal to the left node
            return rootNode.left
        
        #If the tree has two children;
        #Find the smallest value in the tree that is larger than the root. Because it is larger than root, it has to be the smalles in the right branch
        #Set the root to that "next" value, and remove said value so it doesn't occure several times in the tree.
        nextNode = findSmallest(rootNode.right)
        rootNode.value = nextNode.value
        rootNode.right = deleteKey(rootNode.right, rootNode.value)

    return rootNode


def displayTree(rootNode):
    os.system("mode con: cols={} lines={}".format(screenWidth, screenHeight)) #Set screen dimensions
    print "\033[2J" #Clear screen

    xpos = int(screenWidth / 2) - 1
    ypos = 2

    displayNode(rootNode, xpos, ypos)

def displayNode(node, xpos, ypos):
    xoffset = widthspacing / (2*int(ypos / 2))
    if ypos == 8:
        xpos -= 5
    print ("\033[{};{}H".format(ypos, xpos)), #Set cursor position
    if node == None: return
    print node.value,
    print "\033[1B", #Move one line down
    if node.left != None and node.right != None:
        print "\033["+str(int(xoffset / 2) + lineLeftOffset)+"D/"+ " "*xoffset + "\\", #Move a certain number of characters left and print both "branches"
    elif node.left != None:
        print "\033["+str(int(xoffset / 2) + lineLeftOffset)+"D/", #Move a certain number of characters left and print left branch
    elif node.right != None:
        print "\033["+str(int(xoffset/2) - lineLeftOffset)+"C\\", #Move a certain number of characters right and print right branch
    ypos += 1
    if node.left != None:
        xpos -= int(xoffset / 2)
        displayNode(node.left, xpos, ypos+1)
    if node.right != None:
        xpos += xoffset
        displayNode(node.right, xpos, ypos+1)
        
def swapItems(arr, a, b):
    temp  = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
    return arr

def createBalancedTree(inList):
    if len(inList) == 0:
        return None
    if len(inList) == 1:
        return Node(inList[0])
    medianIndex = int((len(inList)-1) / 2)
    median = inList[medianIndex]

    smaller = []
    larger = []

    for i in inList:
        if i < median:
            smaller.append(i)
        elif i > median:
            larger.append(i)
        

    rootNode = Node(median)
    rootNode.left = createBalancedTree(smaller)
    rootNode.right = createBalancedTree(larger)


    return rootNode

###Demo code:


#Create tree
#oot = createTree([50, 30, 70, 40, 60, 80])
root = createTree([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

widthspacing = 0
print "Tree generated from a sorted list:"
raw_input("\nShow tree (enter)")
displayTree(root)

#List all items
print "\nIn-order traversal"
print inorder(root)

root = createBalancedTree(inorder(root))
widthspacing = 40
print "\n\n\n\n\nTree has been autobalanced"
raw_input("\nShow tree (enter)")
displayTree(root)
print "\n"
findPath(root, 90)
"""
root.insert(35)
deleteKey(root, 40)
displayTree(root)

print "\n"
findPath(root, 30)
"""