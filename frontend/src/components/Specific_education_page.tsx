"use client";

import React, { useEffect, useState } from "react";
import { educationContent } from "@/constants/education";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconBook,
  IconCheck,
  IconClipboard,
  IconVideo,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";

interface SpecificEducationPageProps {
  topic: string;
}

export function SpecificEducationPage({ topic }: SpecificEducationPageProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // Find the matching content for the provided topic
    const topicContent = educationContent.find(
      (item) => item.id.toLowerCase() === topic.toLowerCase()
    );

    if (topicContent) {
      setContent(topicContent);
    } else {
      console.error(`Content for topic "${topic}" not found`);
    }

    setLoading(false);
  }, [topic]);
  const handleAnswer = (questionIdx: number, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };
  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    let newScore = 0;
    content.quiz.questions.forEach((question: any, idx: number) => {
      if (userAnswers[idx] === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setQuizSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Topic Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We couldn't find educational content for this topic. Please try
          another topic or check back later.
        </p>
        <Link href="/education">
          <Button variant="outline" className="flex items-center gap-2">
            <IconArrowLeft size={16} />
            <span>Return to Education Hub</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center mb-6">
        <Link href="/education">
          <Button variant="ghost" className="flex items-center gap-2">
            <IconArrowLeft size={16} />
            <span>Back to Topics</span>
          </Button>
        </Link>
      </div>

      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {content.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {content.subtitle}
            </p>
          </div>
        </div>

        {content.image && (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={content.image}
              alt={content.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <Tabs
        defaultValue="overview"
        className="mb-12"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="glossary" className="hidden md:block">
            Glossary
          </TabsTrigger>
          <TabsTrigger value="quiz" className="hidden md:block">
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    {content.overview &&
                      content.overview.map((paragraph: string, idx: number) => (
                        <p key={idx} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>

                  {content.keyPoints && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Key Points</h3>
                      <ul className="space-y-2">
                        {content.keyPoints.map((point: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1 text-green-500">
                              <IconCheck size={16} />
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Learning Path</h3>
                  <div className="space-y-4">
                    {content.learningPath &&
                      content.learningPath.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-900"
                        >
                          {item.type === "video" ? (
                            <IconVideo className="text-blue-500" size={20} />
                          ) : (
                            <IconBook className="text-blue-500" size={20} />
                          )}
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">
                              {item.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Difficulty Level
                    </h3>
                    <div className="flex items-center gap-2">
                      {["ALL"].map((level) => (
                        <span
                          key={level}
                          className={cn(
                            "px-2 py-1 text-xs rounded-full",
                            content.difficulty === level
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                          )}
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lessons">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Course Lessons</h2>

              {content.lessons &&
                content.lessons.map((lesson: any, idx: number) => (
                  <div key={idx} className="mb-8 border-b pb-6 last:border-b-0">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                      <h3 className="text-xl font-semibold">
                        {idx + 1}. {lesson.title}
                      </h3>
                      <span className="text-sm text-gray-500 mt-1 md:mt-0">
                        {lesson.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {lesson.description}
                    </p>

                    {lesson.content && (
                      <div className="prose dark:prose-invert max-w-none">
                        {lesson.content.map(
                          (paragraph: string, pIdx: number) => (
                            <p key={pIdx} className="mb-3">
                              {paragraph}
                            </p>
                          )
                        )}
                      </div>
                    )}

                    {lesson.example && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <h4 className="font-medium mb-2">Example:</h4>
                        <p>{lesson.example}</p>
                      </div>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.resources &&
                  content.resources.map((resource: any, idx: number) => {
                    const isExternal = /^https?:\/\//.test(resource.link);
                    return (
                      <div
                        key={idx}
                        className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-medium">
                            {resource.title}
                          </h3>
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded-full",
                              resource.type === "article"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : resource.type === "video"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            )}
                          >
                            {resource.type}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {resource.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            {resource.source} • {resource.duration || "N/A"}
                          </div>
                          {isExternal ? (
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <span>View</span>
                                <IconArrowRight size={14} />
                              </Button>
                            </a>
                          ) : (
                            <Link href={resource.link}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <span>View</span>
                                <IconArrowRight size={14} />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glossary">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Glossary of Terms</h2>

              <div className="grid grid-cols-1 gap-4">
                {content.glossary &&
                  content.glossary.map((item: any, idx: number) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <h3 className="text-lg font-medium mb-1">{item.term}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.definition}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Test Your Knowledge</h2>
              {!quizSubmitted ? (
                <form onSubmit={handleSubmitQuiz}>
                  {content.quiz && content.quiz.questions && (
                    <div className="space-y-8">
                      {content.quiz.questions.map(
                        (question: any, idx: number) => (
                          <div key={idx} className="border rounded-lg p-5">
                            <h3 className="text-lg font-medium mb-3">
                              Question {idx + 1}: {question.text}
                            </h3>
                            <div className="space-y-2 mb-4">
                              {question.options.map(
                                (option: string, optIdx: number) => (
                                  <div
                                    key={optIdx}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      type="radio"
                                      id={`q${idx}-opt${optIdx}`}
                                      name={`question-${idx}`}
                                      value={optIdx}
                                      checked={userAnswers[idx] === optIdx}
                                      onChange={() => handleAnswer(idx, optIdx)}
                                      className="rounded-full border-gray-300"
                                    />
                                    <label htmlFor={`q${idx}-opt${optIdx}`}>
                                      {option}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button type="submit">Submit Answers</Button>
                  </div>
                </form>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Your Score: {score} / {content.quiz.questions.length}
                  </h3>
                  {content.quiz.questions.map((question: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-5 mb-4">
                      <h3 className="text-lg font-medium mb-3">
                        Question {idx + 1}: {question.text}
                      </h3>
                      <p className="mb-2">
                        Your Answer:{" "}
                        {question.options[userAnswers[idx]] || "Not Answered"}
                      </p>
                      <p className="mb-2">
                        Correct Answer:{" "}
                        {question.options[question.correctAnswer]}
                      </p>
                      {userAnswers[idx] === question.correctAnswer ? (
                        <p className="text-green-600 font-semibold">Correct</p>
                      ) : (
                        <p className="text-red-600 font-semibold">Incorrect</p>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        // Reset quiz to allow retake
                        setQuizSubmitted(false);
                        setUserAnswers({});
                        setScore(0);
                      }}
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {content.relatedTopics &&
            content.relatedTopics.map((relTopic: any, idx: number) => (
              <Link
                href={`/education/${relTopic.id}`}
                key={idx}
                className="block h-full"
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium mb-2">
                        {relTopic.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {relTopic.description}
                      </p>
                    </div>
                    <div className="mt-auto pt-2">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 px-0 hover:bg-transparent"
                      >
                        <span>Explore</span>
                        <IconArrowRight size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SpecificEducationPage;
