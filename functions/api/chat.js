export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("请使用 POST 请求", { status: 405 });
  }

  try {
    const { question } = await context.request.json();
    const answer = await context.env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct-fast",  // ← 改这里
      {
        messages: [
          { role: "system", content: "你是一位专业、友好的医疗旅行助理，请用中文简明扼要地回答用户的问题。" },
          { role: "user", content: question }
        ]
      }
    );
    return Response.json({ answer: answer.response });
  } catch (error) {
    console.error("AI error:", error);
    return Response.json({ error: "AI 调用失败，请稍后再试。" }, { status: 500 });
  }
}
