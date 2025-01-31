"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sampleText: string =
	"The quick brown fox jumps over the lazy dog. This is a pangram, which means it contains every letter of the alphabet at least once. Typing tests often include such sentences to measure speed and accuracy.";

export default function TypingTestApp() {
	const [input, setInput] = useState<string>("");
	const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
	const [timeLeft, setTimeLeft] = useState<number>(30);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [wpm, setWpm] = useState<number>(0);
	const [correctness, setCorrectness] = useState<boolean[]>([]);
	const [hasStarted, setHasStarted] = useState<boolean>(false);
	const [showResults, setShowResults] = useState<boolean>(false);
	const containerRef = useRef<any>(null);

	useEffect(() => {
		let timer: any;
		if (isRunning && timeLeft > 0) {
			timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
		} else if (timeLeft === 0) {
			setIsRunning(false);
			calculateWPM();
			setShowResults(true);
		}
		return () => clearInterval(timer);
	}, [isRunning, timeLeft]);

	const handleKeyPress = (e: any) => {
		if (timeLeft <= 0) return;

		if (!isRunning && timeLeft > 0) setIsRunning(true);

		if (e.key === "Backspace") {
			setInput((prev) => prev.slice(0, -1));
			setCurrentCharIndex((prev) => (prev > 0 ? prev - 1 : 0));
			setCorrectness((prev) => prev.slice(0, -1));
		} else if (e.key.length === 1 && currentCharIndex < sampleText.length) {
			const isCorrect: boolean = e.key === sampleText[currentCharIndex];
			setInput((prev) => prev + e.key);
			setCurrentCharIndex((prev) => prev + 1);
			setCorrectness((prev) => [...prev, isCorrect]);
		}
	};

	const calculateWPM = () => {
		const correctChars: number = correctness.filter(Boolean).length;
		const wordsTyped: number = correctChars / 5;
		setWpm(Math.round((wordsTyped / 30) * 60));
	};

	const resetTest = () => {
		setInput("");
		setCurrentCharIndex(0);
		setTimeLeft(30);
		setIsRunning(false);
		setWpm(0);
		setCorrectness([]);
		setHasStarted(false);
		setShowResults(false);
	};

	const getHighlightedText = () => {
		return sampleText.split("").map((char, idx) => {
			const isCurrent: boolean = idx === currentCharIndex;
			const isCorrect: boolean = idx < currentCharIndex && correctness[idx];
			const isWrong: boolean = idx < currentCharIndex && !correctness[idx];

			const color: string = isCorrect
				? "text-green-500"
				: isWrong
				? "text-red-500"
				: isCurrent
				? "bg-blue-200"
				: "text-gray-400";

			return (
				<span key={idx} className={`${color} font-medium`}>
					{char}
				</span>
			);
		});
	};

	const correctChars = correctness.filter(Boolean).length;
	const totalChars = currentCharIndex;
	const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
	console.log(containerRef);
	return (
		<div
			className="w-full min-h-screen content-center"
			tabIndex={0}
			onKeyDown={hasStarted ? handleKeyPress : undefined}
			ref={containerRef}
		>
			<div className="max-w-2xl shadow-lg px-4 mx-auto">
				<h1 className="text-2xl font-bold mb-4 text-center">Typing Test</h1>

				<div className="relative">
					<div className="text-xl w-full bg-white p-4 rounded border border-gray-300">
						{getHighlightedText()}
					</div>
					{!hasStarted && (
						<div
							className="absolute inset-0 bg-white/90 flex items-center justify-center cursor-pointer rounded border-2 border-dashed border-gray-300"
							onClick={() => {
								setHasStarted(true);
								containerRef.current?.focus();
							}}
						>
							<span className="text-gray-500 text-lg font-medium">
								Click here to start typing
							</span>
						</div>
					)}
				</div>

				<div className="flex justify-between items-center mt-4">
					<p className="text-lg font-medium">Time Left: {timeLeft}s</p>
					<p className="text-lg font-medium">WPM: {wpm}</p>
				</div>

				{showResults && (
					<Card className="mt-4">
						<CardContent className="p-4 space-y-2">
							<h2 className="text-xl font-bold mb-2">Test Results</h2>
							<p className="text-lg">WPM: {wpm}</p>
							<p className="text-lg">Accuracy: {accuracy.toFixed(1)}%</p>
							<p className="text-lg">Correct characters: {correctChars}</p>
							<p className="text-lg">
								Incorrect characters: {totalChars - correctChars}
							</p>
						</CardContent>
					</Card>
				)}

				<div className="flex justify-center mt-6">
					<Button
						onClick={resetTest}
						className="px-6 py-5 mb-3 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
					>
						Reset Test
					</Button>
				</div>
			</div>
		</div>
	);
}
