package main

//Felix Albrigtsen 2021
//BrainFuck interpreter in Go, my very first project in golang
//Reads program from a file, executes it with the supplied input and give output to STDOUT or file.
//Execute without a filename for usage instructions.

import (
	"bufio"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
)

const tapeSize = uint32((^uint16(0))) + 1 //Maximum value of the ptr, 65536

//Takes the BrainFuck script and input as string, executes the program code and returns the output.
func evaluateBF(bfCode, userInput string, debug bool) (output string, err error) {
	pc := 0        //Program Counter, current position in code
	var ptr uint16 //Tape pointer, what cell is being manipulated/read
	var tape [tapeSize]uint8

	for pc < len(bfCode) {
		if debug {
			fmt.Printf("$PC=%v\tOpcode=%v\t$PTR=%v\tValue=%v\n", pc, string(bfCode[pc]), ptr, tape[ptr]) //Print debug string, containing runtime info
		}
		opCode := bfCode[pc]
		switch opCode {
		case '+':
			tape[ptr]++ //Increment cell value
		case '-':
			tape[ptr]-- //Decrement cell value
		case '>':
			ptr++ //Increment tape pointer (next cell)
		case '<':
			ptr-- //Decrement tape pointer (previous cell)
		case '[':
			if tape[ptr] == 0 {
				openB := 0
				closeB := 0
				for closeB != (openB + 1) { //Skip to corresponding closing bracket if val==0
					pc++
					if pc == len(bfCode) {
						return output, errors.New("Compiler error: Mismatched brackets")
					}
					switch bfCode[pc] {
					case '[':
						openB++
					case ']':
						closeB++
					}
				}
			}
		case ']':
			if tape[ptr] != 0 {
				openB := 0
				closeB := 0
				for openB != (closeB + 1) { //Step back to corresponding opening bracket if val != 0
					pc--
					if pc == -1 {
						return output, errors.New("Compiler error: Mismatched brackets")
					}
					switch bfCode[pc] {
					case '[':
						openB++
					case ']':
						closeB++
					}
				}
			}

		case '.':
			output += string(tape[ptr]) //Print the cell byte (ascii)
		case ',':
			if len(userInput) == 0 {
				return output, errors.New("EOF, Program requested more input than available")
			}
			tape[ptr] = uint8(userInput[0]) //Read a byte input (ascii)
			userInput = userInput[1:]       //Remove first element from queue

		}
		pc++
	}

	return output, nil
}

func main() {
	//Set CLI flags
	outputFile := flag.String("o", "", "If set, save program output to a file. Default: STDOUT")
	debug := flag.Bool("d", false, "Enable debug logging")
	inputFile := flag.String("i", "", "If set, read program input from a file. Default: STDIN")
	flag.Parse()

	//Show help if no file is specified
	fileName := flag.Arg(0)
	if fileName == "" {
		fmt.Printf("No filename specified, try: %v [flags] filename.bf\n\n", os.Args[0])
		flag.Usage()

		return
	}

	//Read file from disk using ioutil
	fileContent, err := ioutil.ReadFile(fileName)
	if err != nil {
		log.Fatal(err)
	}

	userInput := ""

	if *inputFile == "" {
		//Read user input if the program might need it (STDIN)
		reader := bufio.NewReader(os.Stdin)
		if strings.Contains(string(fileContent), ",") {
			fmt.Print("Program Input: ")
			userInput, _ = reader.ReadString('\n')
			userInput = strings.Replace(userInput, "\n", "", -1) // convert CRLF to LF
		}
	} else {
		//Read program input from a file
		inputRead, err := ioutil.ReadFile(*inputFile)
		if err != nil {
			log.Fatal(err)
		}
		userInput = string(inputRead)
	}

	res, err := evaluateBF(string(fileContent), userInput, *debug)

	if *outputFile == "" { //Default output to STDOUT
		fmt.Println(res)
	} else {
		err := ioutil.WriteFile(*outputFile, []byte(res), 0644) //Save to file if specified
		if err != nil {
			log.Fatal((err))
		}
	}

	if err != nil {
		//If the BrainFuck-evaluator returns an error, display it, but not as fatal/panic
		fmt.Print("\n")
		log.Print(err)
	}

	return
}
