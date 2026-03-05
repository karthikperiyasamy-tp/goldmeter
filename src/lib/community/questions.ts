import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import type { Question, Answer, QuestionCategory } from "@/types/community";

function questionsCol() {
  return collection(getFirebaseFirestore(), "questions");
}

function answersCol(questionId: string) {
  return collection(getFirebaseFirestore(), "questions", questionId, "answers");
}

export async function getQuestions(
  category?: QuestionCategory,
  max = 50
): Promise<Question[]> {
  const constraints = category
    ? [where("category", "==", category), firestoreLimit(max)]
    : [firestoreLimit(max)];
  const q = query(questionsCol(), ...constraints);
  const snap = await getDocs(q);
  const questions = snap.docs.map((d) => d.data() as Question);
  return questions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getQuestion(
  questionId: string
): Promise<Question | null> {
  const snap = await getDoc(doc(questionsCol(), questionId));
  return snap.exists() ? (snap.data() as Question) : null;
}

export async function askQuestion(
  uid: string,
  displayName: string,
  photoURL: string | null,
  title: string,
  body: string,
  category: QuestionCategory
): Promise<Question> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const question: Question = {
    id,
    uid,
    displayName,
    photoURL,
    title,
    body,
    category,
    createdAt: now,
    updatedAt: now,
    answerCount: 0,
    viewCount: 0,
    tags: [],
  };
  await setDoc(doc(questionsCol(), id), question);
  return question;
}

export async function incrementViewCount(questionId: string): Promise<void> {
  await updateDoc(doc(questionsCol(), questionId), {
    viewCount: increment(1),
  });
}

export async function getAnswers(questionId: string): Promise<Answer[]> {
  const q = query(answersCol(questionId), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Answer);
}

export async function addAnswer(
  questionId: string,
  uid: string,
  displayName: string,
  photoURL: string | null,
  text: string
): Promise<Answer> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const answer: Answer = {
    id,
    uid,
    displayName,
    photoURL,
    text,
    createdAt: now,
    updatedAt: now,
    likes: 0,
    likedBy: [],
    helpful: false,
  };
  await setDoc(doc(answersCol(questionId), id), answer);
  await updateDoc(doc(questionsCol(), questionId), {
    answerCount: increment(1),
    updatedAt: now,
  });
  return answer;
}

export async function toggleAnswerLike(
  questionId: string,
  answerId: string,
  uid: string,
  isLiked: boolean
): Promise<void> {
  const ref = doc(answersCol(questionId), answerId);
  if (isLiked) {
    await updateDoc(ref, { likedBy: arrayRemove(uid), likes: increment(-1) });
  } else {
    await updateDoc(ref, { likedBy: arrayUnion(uid), likes: increment(1) });
  }
}

export async function markHelpful(
  questionId: string,
  answerId: string,
  helpful: boolean
): Promise<void> {
  const ref = doc(answersCol(questionId), answerId);
  await updateDoc(ref, { helpful });
}
