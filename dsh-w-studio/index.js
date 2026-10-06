// src/index.ts
import { dirname as dirname4, resolve as resolve5 } from "node:path";
import { createRequire } from "node:module";
import { readFileSync as readFileSync2 } from "node:fs";
import { homedir as homedir2 } from "node:os";
import z3 from "@deepseek-ai/schemastery";

// ../../../deepseek-harness/packages/util/home-paths/lib/index.js
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
var DSH_HOME_DIR_NAME = ".dsh";
var DEFAULT_DSH_HOME_DISPLAY = `~/${DSH_HOME_DIR_NAME}`;
var DSH_HOME_ENV = "DSH_HOME";
function defaultDshHome() {
  return join(homedir(), DSH_HOME_DIR_NAME);
}
function expandHomePath(path) {
  if (path === "~") return homedir();
  if (path.startsWith("~/") || path.startsWith("~\\")) return join(homedir(), path.slice(2));
  return path;
}
function resolveDshHome(configured, env = process.env) {
  const fromEnv = env[DSH_HOME_ENV];
  return resolve(expandHomePath(configured ?? (fromEnv !== void 0 && fromEnv.trim().length > 0 ? fromEnv : defaultDshHome())));
}

// src/studio.ts
import { randomUUID as randomUUID3, createHash as createHash2 } from "node:crypto";
import { mkdir as mkdir3, readFile as readFile2, writeFile as writeFile3, realpath as realpath2, stat, unlink } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join as join3, resolve as resolve2, relative as relative2, isAbsolute as isAbsolute2 } from "node:path";
import z2 from "@deepseek-ai/schemastery";

// ../../../deepseek-harness/packages/util/atomic-write/lib/index.js
import { randomBytes } from "node:crypto";
import { lstat, mkdir, rename, rm, writeFile } from "node:fs/promises";
import { dirname as dirname2 } from "node:path";
var WINDOWS_TRANSIENT_RENAME_ERRORS = /* @__PURE__ */ new Set([
  "EACCES",
  "EBUSY",
  "EPERM"
]);
var WINDOWS_RENAME_RETRY_INITIAL_MS = 20;
var WINDOWS_RENAME_RETRY_MAX_MS = 200;
var WINDOWS_RENAME_RETRY_LIMIT = 8;
function isTransientWindowsRenameError(error) {
  if (process.platform !== "win32") return false;
  return WINDOWS_TRANSIENT_RENAME_ERRORS.has(error?.code ?? "");
}
async function renameAtomicTemp(temp, filename) {
  let delay = WINDOWS_RENAME_RETRY_INITIAL_MS;
  for (let retries = 0; ; retries += 1) {
    try {
      await rename(temp, filename);
      return;
    } catch (error) {
      if (!isTransientWindowsRenameError(error)) throw error;
      if (retries >= WINDOWS_RENAME_RETRY_LIMIT) throw error;
    }
    await new Promise((resolve6) => setTimeout(resolve6, delay));
    delay = Math.min(delay * 2, WINDOWS_RENAME_RETRY_MAX_MS);
  }
}
async function writeFileAtomic(filename, content, options) {
  await mkdir(dirname2(filename), {
    recursive: true,
    ...options.dirMode === void 0 ? {} : { mode: options.dirMode }
  });
  const temp = `${filename}.${randomBytes(6).toString("hex")}.tmp`;
  try {
    await writeFile(temp, content, {
      mode: options.mode,
      flag: "wx"
    });
    await renameAtomicTemp(temp, filename);
  } catch (error) {
    await rm(temp, { force: true });
    throw error;
  }
}

// src/validation.ts
import { isAbsolute, normalize, relative } from "node:path";
import { randomUUID as randomUUID2 } from "node:crypto";

// src/templates.ts
import { randomUUID } from "node:crypto";
var lean = [
  ["\u4EA7\u54C1\u8D1F\u8D23\u4EBA", "codex", "\u660E\u786E\u7528\u6237\u3001\u76EE\u6807\u3001\u8303\u56F4\u548C\u9A8C\u6536\u6807\u51C6\uFF0C\u7F16\u5199\u4EA7\u54C1\u6587\u6863\uFF1B\u4E3A\u540E\u7EED\u5C97\u4F4D\u4EA4\u63A5\u53EF\u6267\u884C\u4EFB\u52A1\u3002"],
  ["UI\u8BBE\u8BA1\u5E08", "claude", "\u6839\u636E\u4EA7\u54C1\u6587\u6863\u8BBE\u8BA1\u9875\u9762\u3001\u4EA4\u4E92\u548C\u89C6\u89C9\u89C4\u8303\uFF0C\u4EA4\u4ED8\u53EF\u4F9B\u5DE5\u7A0B\u5E08\u4F7F\u7528\u7684\u8BBE\u8BA1\u6587\u4EF6\u3002"],
  ["\u5168\u6808\u5DE5\u7A0B\u5E08", "codex", "\u6839\u636E\u4EA7\u54C1\u548C\u8BBE\u8BA1\u6587\u6863\u5B9E\u73B0\u8F6F\u4EF6\uFF0C\u8FD0\u884C\u6784\u5EFA\u4E0E\u76F8\u5173\u6D4B\u8BD5\uFF0C\u4EA4\u4ED8\u53EF\u542F\u52A8\u7684\u4EE3\u7801\u3002"],
  ["\u6D4B\u8BD5\u5DE5\u7A0B\u5E08", "harness", "\u9A8C\u8BC1\u529F\u80FD\u4E0E\u9A8C\u6536\u6807\u51C6\uFF0C\u590D\u73B0\u7F3A\u9677\uFF0C\u4FEE\u590D\u6388\u6743\u8303\u56F4\u5185\u7684\u95EE\u9898\uFF0C\u4EA4\u4ED8\u6D4B\u8BD5\u62A5\u544A\u3002"]
];
var full = [
  ["\u4EA7\u54C1\u8D1F\u8D23\u4EBA", "codex", "\u68B3\u7406\u4EA7\u54C1\u76EE\u6807\u3001\u7528\u6237\u6D41\u7A0B\u3001\u9700\u6C42\u4F18\u5148\u7EA7\u548C\u9A8C\u6536\u6807\u51C6\uFF0C\u4EA4\u4ED8\u4EA7\u54C1\u6587\u6863\u3002"],
  ["\u6280\u672F\u8D1F\u8D23\u4EBA", "codex", "\u5B9A\u4E49\u6280\u672F\u65B9\u6848\u3001\u6A21\u5757\u5206\u5DE5\u3001\u6570\u636E\u63A5\u53E3\u548C\u98CE\u9669\uFF0C\u4EA4\u4ED8\u67B6\u6784\u4E0E\u63A5\u53E3\u6587\u6863\u3002"],
  ["UI\u8BBE\u8BA1\u5E08", "claude", "\u8BBE\u8BA1\u754C\u9762\u3001\u4EA4\u4E92\u3001\u54CD\u5E94\u5F0F\u5E03\u5C40\u548C\u7EC4\u4EF6\u89C4\u8303\uFF0C\u4EA4\u4ED8\u8BBE\u8BA1\u6587\u4EF6\u3002"],
  ["\u524D\u7AEF\u5DE5\u7A0B\u5E08", "claude", "\u5B9E\u73B0\u9875\u9762\u548C\u4EA4\u4E92\uFF0C\u5BF9\u63A5\u63A5\u53E3\uFF0C\u9A8C\u8BC1\u54CD\u5E94\u5F0F\u5E03\u5C40\u3001\u65E0\u969C\u788D\u548C\u524D\u7AEF\u6784\u5EFA\u3002"],
  ["\u540E\u7AEF\u5DE5\u7A0B\u5E08", "codex", "\u5B9E\u73B0\u670D\u52A1\u3001\u5B58\u50A8\u548C\u63A5\u53E3\uFF0C\u5904\u7406\u9519\u8BEF\u8DEF\u5F84\uFF0C\u8FD0\u884C\u540E\u7AEF\u6D4B\u8BD5\u3002"],
  ["\u6D4B\u8BD5\u5DE5\u7A0B\u5E08", "harness", "\u6267\u884C\u529F\u80FD\u548C\u96C6\u6210\u9A8C\u6536\uFF0C\u590D\u73B0\u5E76\u4FEE\u590D\u7F3A\u9677\uFF0C\u4EA4\u4ED8\u6D4B\u8BD5\u4E0E\u5269\u4F59\u95EE\u9898\u62A5\u544A\u3002"],
  ["\u4EA4\u4ED8\u8D1F\u8D23\u4EBA", "harness", "\u68C0\u67E5\u4EA4\u4ED8\u7269\u3001\u8FD0\u884C\u65B9\u5F0F\u548C\u6D4B\u8BD5\u8BC1\u636E\uFF0C\u7F16\u5199\u90E8\u7F72\u8BF4\u660E\u4E0E\u4EA4\u4ED8\u6E05\u5355\u3002"]
];
function members(roles) {
  return roles.map(([role, engine2, responsibilities]) => ({
    name: role,
    role,
    responsibilities,
    engine: engine2,
    model: engine2 === "claude" ? "sonnet" : "",
    effort: "",
    permission: "workspace-write",
    baseURL: "",
    apiKeyEnv: "",
    thinkingFormat: "none",
    contextWindow: 262144,
    maxTokens: 32768
  }));
}
function defaultTemplates() {
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  return [
    { id: randomUUID(), name: "\u7CBE\u7B80\u4EA7\u54C1\u56E2\u961F", description: "4 \u4EBA\uFF1A\u4EA7\u54C1\u3001UI \u8BBE\u8BA1\u3001\u5168\u6808\u5F00\u53D1\u3001\u6D4B\u8BD5", members: members(lean), createdAt },
    { id: randomUUID(), name: "\u5B8C\u6574\u7814\u53D1\u56E2\u961F", description: "7 \u4EBA\uFF1A\u4EA7\u54C1\u3001\u6280\u672F\u8D1F\u8D23\u4EBA\u3001UI \u8BBE\u8BA1\u3001\u524D\u7AEF\u3001\u540E\u7AEF\u3001\u6D4B\u8BD5\u3001\u4EA4\u4ED8", members: members(full), createdAt }
  ];
}

// src/schema.ts
import z from "@deepseek-ai/schemastery";
function knownFields(input, schema) {
  if (schema.type === "object" && typeof input === "object" && input !== null && !Array.isArray(input)) {
    for (const key of Object.keys(schema.dict ?? {})) {
      if (!Object.hasOwn(input, key)) throw new Error(`Missing Studio field: ${key}`);
    }
    for (const [key, value] of Object.entries(input)) {
      if (!schema.dict || !Object.hasOwn(schema.dict, key)) throw new Error(`Unexpected Studio field: ${key}`);
      const member = schema.dict[key];
      if (member === void 0) throw new Error(`Missing Studio field validator: ${key}`);
      knownFields(value, member);
    }
  } else if (schema.type === "array" && Array.isArray(input) && schema.inner) {
    for (const value of input) knownFields(value, schema.inner);
  }
}
function parseFields(schema, input) {
  knownFields(input, schema);
  return z.resolve(input, schema, {})[0];
}
var id = z.string().pattern(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/).required();
var text = z.string().max(1e5).required();
var short = z.string().max(500).required();
var engine = z.union(["codex", "claude", "harness", "compatible"]).required();
var permission = z.union(["read-only", "workspace-write", "full-access"]).required();
var memberFields = {
  name: short,
  role: short,
  responsibilities: text,
  engine,
  model: short,
  effort: short,
  permission,
  baseURL: short,
  apiKeyEnv: short,
  thinkingFormat: z.union(["none", "deepseek", "zai"]).required(),
  contextWindow: z.number().step(1).min(1024).max(1e7).required(),
  maxTokens: z.number().step(1).min(1).max(1e6).required()
};
var employeeSchema = z.object({ ...memberFields, id, cwd: short, enabled: z.boolean().required() });
var memberSchema = z.object(memberFields);
var projectFields = {
  id,
  name: short,
  objective: text,
  cwd: short,
  status: z.union(["paused", "running", "completed"]).required(),
  createdAt: short
};
var taskFields = {
  id,
  projectId: id,
  employeeId: id,
  title: short,
  instruction: text,
  dependsOn: z.array(id).required(),
  outputFiles: z.array(short).required(),
  status: z.union(["pending", "running", "completed", "failed", "cancelled", "interrupted"]).required(),
  attempt: z.natural().required(),
  result: text,
  error: text,
  startedAt: short,
  finishedAt: short,
  assignment: text
};
var stateV1Fields = {
  version: z.const(1).required(),
  revision: z.natural().required(),
  employees: z.array(employeeSchema).required(),
  projects: z.array(z.object(projectFields)).required(),
  tasks: z.array(z.object(taskFields)).required(),
  messages: z.array(z.object({
    id,
    projectId: id,
    taskId: z.union([id, z.const(null)]),
    from: id,
    to: id,
    message: text,
    createdAt: short
  })).required(),
  artifacts: z.array(z.object({
    id,
    projectId: id,
    taskId: id,
    name: short,
    size: z.natural().required(),
    sha256: short
  })).required()
};
var stateV1Schema = z.object(stateV1Fields);
var nativeSessionSchema = z.object({
  id,
  engine,
  cwd: short,
  attempt: z.natural().min(1).required(),
  continued: z.boolean().required()
});
var nativeSession = nativeSessionSchema;
var taskV2Fields = {
  ...taskFields,
  nativeSessions: z.array(nativeSession).required(),
  reviewStatus: z.union(["pending", "accepted", "superseded"]).required()
};
var stateV2Fields = {
  ...stateV1Fields,
  version: z.const(2).required(),
  workspaces: z.array(z.object({ id, name: short, path: short, createdAt: short })).required(),
  activeWorkspaceId: z.union([id, z.const(null)]),
  projects: z.array(z.object({
    ...projectFields,
    workspaceId: id,
    acceptanceCriteria: text,
    sessionMode: z.union(["employee-project", "new-task"]).required(),
    status: z.union(["paused", "running", "review", "completed"]).required()
  })).required(),
  tasks: z.array(z.object(taskV2Fields)).required()
};
var stateV2Schema = z.object(stateV2Fields);
var minutesSchema = z.object({
  summary: text,
  decisions: z.array(text).required(),
  projectName: short,
  objective: text,
  acceptanceCriteria: text,
  tasks: z.array(z.object({ employeeId: id, title: short, instruction: text })).required()
});
var meeting = z.object({
  id,
  workspaceId: id,
  title: short,
  agenda: text,
  hostId: id,
  attendeeIds: z.array(id).required(),
  status: z.union(["open", "drafting", "review", "closed"]).required(),
  queue: z.array(id).required(),
  speaking: z.union([id, z.const(null)]),
  error: text,
  messages: z.array(z.object({
    id,
    from: id,
    message: text,
    mentions: z.array(id).required(),
    createdAt: short,
    nativeSession: z.union([nativeSession, z.const(null)])
  })).required(),
  minutes: z.union([minutesSchema, z.const(null)]),
  projectId: z.union([id, z.const(null)]),
  createdAt: short
});
var stateV3Fields = { ...stateV2Fields, version: z.const(3).required(), meetings: z.array(meeting).required() };
var stateV3Schema = z.object(stateV3Fields);
var templateSchema = z.object({ id, name: short, description: text, members: z.array(memberSchema).required(), createdAt: short });
var stateV4Fields = { ...stateV3Fields, version: z.const(4).required(), templates: z.array(templateSchema).required() };
var stateV4Schema = z.object(stateV4Fields);
var stateSchema = z.object({
  ...stateV4Fields,
  version: z.const(5).required(),
  tasks: z.array(z.object({
    ...taskV2Fields,
    status: z.union(["pending", "running", "waiting", "completed", "failed", "cancelled", "interrupted"]).required(),
    question: text,
    reply: text
  })).required()
});

// src/validation.ts
function parseState(input) {
  const state = parseFields(stateSchema, input);
  const identities = (values) => {
    const map = new Map(values.map((value) => [value.id, value]));
    if (map.size !== values.length) throw new Error("Studio data contains duplicate identities");
    return map;
  };
  const employees = identities(state.employees);
  const workspaces = identities(state.workspaces);
  if (state.activeWorkspaceId !== null && !workspaces.has(state.activeWorkspaceId)) throw new Error("Active company workspace is missing");
  for (const workspace of workspaces.values()) if (!isAbsolute(workspace.path)) throw new Error("Stored company directory must be absolute");
  const projects = identities(state.projects);
  const tasks = identities(state.tasks);
  identities(state.messages);
  identities(state.artifacts);
  for (const employee of employees.values()) validateEmployee(employee);
  for (const project of projects.values()) {
    const workspace = workspaces.get(project.workspaceId);
    if (!workspace || !isAbsolute(project.cwd) || !withinDirectory(workspace.path, project.cwd)) throw new Error("Stored project must belong to its company directory");
  }
  const visited = /* @__PURE__ */ new Set();
  const pending = /* @__PURE__ */ new Set();
  const visit = (id2) => {
    if (visited.has(id2)) return;
    if (pending.has(id2)) throw new Error("Stored task dependencies contain a cycle");
    const task = tasks.get(id2);
    if (!task || !employees.has(task.employeeId) || !projects.has(task.projectId)) throw new Error("Stored task refers to a missing employee or project");
    pending.add(id2);
    for (const dependency of task.dependsOn) {
      if (tasks.get(dependency)?.projectId !== task.projectId) throw new Error("Stored dependency belongs to a different project or is missing");
      visit(dependency);
    }
    for (const name2 of task.outputFiles) outputName(name2);
    for (const session of task.nativeSessions) {
      if (!isAbsolute(session.cwd) || session.attempt > task.attempt) throw new Error("Stored native session metadata is invalid");
    }
    pending.delete(id2);
    visited.add(id2);
  };
  for (const id2 of tasks.keys()) visit(id2);
  for (const message of state.messages) {
    if (!projects.has(message.projectId) || message.from !== "user" && !employees.has(message.from) || message.to !== "team" && !employees.has(message.to) || message.taskId !== null && tasks.get(message.taskId)?.projectId !== message.projectId) throw new Error("Stored message refers to a missing participant or task");
  }
  for (const file of state.artifacts) {
    if (tasks.get(file.taskId)?.projectId !== file.projectId || !/^[a-f0-9]{64}$/.test(file.sha256)) throw new Error("Stored artifact metadata is invalid");
    outputName(file.name);
  }
  identities(state.meetings);
  for (const meeting2 of state.meetings) {
    const people = new Set(meeting2.attendeeIds);
    if (!workspaces.has(meeting2.workspaceId) || !people.has(meeting2.hostId) || people.size !== meeting2.attendeeIds.length || meeting2.attendeeIds.some((id2) => !employees.has(id2)) || meeting2.queue.some((id2) => !people.has(id2)) || meeting2.speaking !== null && !people.has(meeting2.speaking) || meeting2.projectId !== null && !projects.has(meeting2.projectId)) throw new Error("Stored meeting refers to a missing participant, workspace, or project");
    identities(meeting2.messages);
    for (const message of meeting2.messages) {
      if (message.from !== "user" && !employees.has(message.from) || message.mentions.some((id2) => !employees.has(id2))) throw new Error("Stored meeting message refers to a missing employee");
      if (message.nativeSession) {
        parseFields(nativeSessionSchema, message.nativeSession);
        if (!isAbsolute(message.nativeSession.cwd)) throw new Error("Stored native session metadata is invalid");
      }
    }
    if (meeting2.minutes) {
      parseFields(minutesSchema, meeting2.minutes);
      if (meeting2.minutes.tasks.some((task) => !employees.has(task.employeeId))) throw new Error("Stored meeting minutes refer to a missing employee");
    }
  }
  identities(state.templates);
  for (const template of state.templates) {
    if (!template.name.trim() || !template.members.length) throw new Error("Stored team template needs a name and members");
    for (const member of template.members) validateMember(member);
  }
  return state;
}
function migrateStateV2(input) {
  return migrateStateV3({ ...parseFields(stateV2Schema, input), version: 3, meetings: [] });
}
function migrateStateV3(input) {
  return migrateStateV4({ ...parseFields(stateV3Schema, input), version: 4, templates: defaultTemplates() });
}
function migrateStateV4(input) {
  const old = parseFields(stateV4Schema, input);
  return parseState({ ...old, version: 5, tasks: old.tasks.map((task) => ({ ...task, question: "", reply: "" })) });
}
function migrateStateV1(input) {
  const old = parseFields(stateV1Schema, input);
  const workspaces = [];
  const projects = old.projects.map((project) => {
    let workspace = workspaces.find((value) => value.path === project.cwd);
    if (!workspace) {
      workspace = { id: randomUUID2(), name: project.name, path: project.cwd, createdAt: project.createdAt };
      workspaces.push(workspace);
    }
    return { ...project, workspaceId: workspace.id, acceptanceCriteria: "", sessionMode: "new-task" };
  });
  return migrateStateV2({
    ...old,
    version: 2,
    workspaces,
    activeWorkspaceId: workspaces.at(-1)?.id ?? null,
    projects,
    tasks: old.tasks.map((task) => ({ ...task, nativeSessions: [], reviewStatus: task.status === "completed" ? "accepted" : "pending" }))
  });
}
function withinDirectory(root, path) {
  const rel = relative(root, path);
  return rel !== ".." && !rel.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute(rel);
}
function validateEmployee(employee) {
  if (!employee.name.trim() || !employee.role.trim()) throw new Error("Employee name and role are required");
  if (employee.cwd && !isAbsolute(employee.cwd)) throw new Error("Employee working directory must be absolute");
  if (employee.apiKeyEnv && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(employee.apiKeyEnv)) throw new Error("Credential reference must be an environment variable name");
  const efforts = {
    codex: ["", "none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"],
    claude: ["", "low", "medium", "high", "xhigh", "max"],
    harness: ["", "off", "low", "high", "max"],
    compatible: ["", "minimal", "low", "medium", "high", "xhigh"]
  };
  if (!efforts[employee.engine].includes(employee.effort)) throw new Error(`Unsupported ${employee.engine} effort: ${employee.effort}`);
  if (employee.engine === "compatible") {
    const url = new URL(employee.baseURL);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("Provider URL must use HTTP(S) without embedded credentials");
    if (!employee.model || !employee.apiKeyEnv) throw new Error("Compatible providers require a model and credential reference");
  }
}
function validateMember(member) {
  validateEmployee({ ...member, id: "template-member", cwd: "", enabled: true });
}
function outputName(name2) {
  if (!name2 || isAbsolute(name2) || name2.includes("\0") || name2.includes(":")) throw new Error("Output files must be project-relative paths");
  const segments = name2.replaceAll("\\", "/").split("/");
  if (segments.some((segment) => [
    "..",
    ".git",
    ".codex",
    ".claude",
    ".claude.json",
    ".dsh",
    ".credentials.yaml",
    ".deepseek-harness"
  ].includes(segment.toLowerCase()) || segment.toLowerCase().startsWith(".env"))) throw new Error("Private files and parent paths cannot be shared as results");
  return normalize(name2);
}

// src/workspace.ts
import { mkdir as mkdir2, realpath, lstat as lstat2, readFile, writeFile as writeFile2 } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join as join2 } from "node:path";
async function exportProject(state, project, storageRoot) {
  const workspace = state.workspaces.find((value) => value.id === project.workspaceId);
  if (!workspace) throw new Error("Company workspace does not exist");
  const root = await realpath(workspace.path);
  let dir = root;
  for (const part of [".studio", "projects", project.id]) {
    dir = join2(dir, part);
    try {
      await mkdir2(dir);
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
    }
    if ((await lstat2(dir)).isSymbolicLink() || !withinDirectory(root, await realpath(dir))) throw new Error("Public export directory must stay inside the company workspace");
  }
  const tasks = state.tasks.filter((value) => value.projectId === project.id);
  const messages = state.messages.filter((value) => value.projectId === project.id);
  const artifacts = state.artifacts.filter((value) => value.projectId === project.id);
  const artifactDir = join2(dir, "artifacts");
  try {
    await mkdir2(artifactDir);
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
  }
  if ((await lstat2(artifactDir)).isSymbolicLink() || !withinDirectory(root, await realpath(artifactDir))) throw new Error("Public artifact export must stay inside the company workspace");
  for (const artifact of artifacts) {
    const bytes = await readFile(join2(storageRoot, "artifacts", artifact.id));
    if (createHash("sha256").update(bytes).digest("hex") !== artifact.sha256) throw new Error("Stored result file hash does not match");
    const path = join2(artifactDir, artifact.id);
    try {
      if ((await lstat2(path)).isSymbolicLink()) throw new Error("Public artifact export cannot be a symbolic link");
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
    try {
      await writeFile2(path, bytes, { flag: "wx", mode: 384 });
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
      if (createHash("sha256").update(await readFile(path)).digest("hex") !== artifact.sha256) throw new Error("Existing exported artifact differs from its published result");
    }
  }
  const files = {
    "brief.md": `# ${project.name}

${project.objective}

## Acceptance criteria

${project.acceptanceCriteria}
`,
    "board.json": `${JSON.stringify({ project, tasks: tasks.map(({ assignment: _assignment, nativeSessions: _sessions, ...task }) => task), artifacts }, null, 2)}
`,
    "handoffs.md": `# Handoffs

${messages.map((value) => `## ${value.createdAt} \xB7 ${value.from} \u2192 ${value.to}

${value.message}`).join("\n\n")}
`,
    "artifact-locations.json": `${JSON.stringify(artifacts.map((value) => ({ ...value, path: `artifacts/${value.id}` })), null, 2)}
`
  };
  for (const [name2, content] of Object.entries(files)) {
    const target = join2(dir, name2);
    try {
      if ((await lstat2(target)).isSymbolicLink()) throw new Error("Public export file cannot be a symbolic link");
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    }
    await writeFileAtomic(target, content, { mode: 384, dirMode: 448 });
  }
}

// src/roster.ts
function hasHistory(state, id2) {
  return state.tasks.some((task) => task.employeeId === id2) || state.meetings.some((meeting2) => meeting2.attendeeIds.some((value) => value === id2) || meeting2.messages.some((message) => message.from === id2) || meeting2.minutes?.tasks.some((task) => task.employeeId === id2) === true);
}
function seat(value) {
  return `${value.name.trim()}\0${value.role.trim()}`;
}
function planTemplate(state, template) {
  const plan = { keep: [], add: [], remove: [], disable: [] };
  const claimed = /* @__PURE__ */ new Set();
  for (const member of template.members) {
    const match = state.employees.find((employee) => !claimed.has(employee.id) && seat(employee) === seat(member));
    if (match) {
      claimed.add(match.id);
      plan.keep.push(match);
    } else plan.add.push(member);
  }
  for (const employee of state.employees) {
    if (claimed.has(employee.id)) continue;
    if (hasHistory(state, employee.id)) {
      if (employee.enabled) plan.disable.push(employee);
    } else plan.remove.push(employee);
  }
  return plan;
}

// src/studio.ts
var commandSchema = z2.object({
  action: z2.string().required(),
  expectedRevision: z2.natural().required(),
  input: z2.any().required()
});
var projectInput = z2.object({
  name: z2.string().min(1).max(500).required(),
  objective: z2.string().min(1).max(1e5).required(),
  cwd: z2.string().required(),
  workspaceId: z2.string().required(),
  acceptanceCriteria: z2.string().max(1e5).required(),
  sessionMode: z2.union(["employee-project", "new-task"]).required(),
  employeeIds: z2.array(z2.string()).required()
});
var taskInput = z2.object({
  projectId: z2.string().required(),
  employeeId: z2.string().required(),
  title: z2.string().min(1).max(500).required(),
  instruction: z2.string().min(1).max(1e5).required(),
  dependsOn: z2.array(z2.string()).required(),
  outputFiles: z2.array(z2.string()).required()
});
var answerInput = z2.object({ id: z2.string().required(), reply: z2.string().min(1).max(1e5).required() });
var messageInput = z2.object({
  projectId: z2.string().required(),
  to: z2.string().required(),
  message: z2.string().min(1).max(1e5).required()
});
var meetingFields = {
  title: z2.string().min(1).max(500).required(),
  agenda: z2.string().max(1e5).required(),
  hostId: z2.string().required(),
  attendeeIds: z2.array(z2.string()).required()
};
var meetingMessageInput = z2.object({
  id: z2.string().required(),
  message: z2.string().min(1).max(1e5).required(),
  mentions: z2.array(z2.string()).required()
});
var needsUserRule = '\u53EA\u6709\u9047\u5230\u5FC5\u987B\u7531\u7532\u65B9\u672C\u4EBA\u5B8C\u6210\u3001\u4F60\u65E0\u6CD5\u81EA\u884C\u5B8C\u6210\u6216\u7ED5\u8FC7\u7684\u4E8B\uFF08\u4F8B\u5982\u64CD\u4F5C\u771F\u673A\u6216\u786C\u4EF6\u3001\u767B\u5F55\u6216\u63D0\u4F9B\u8D26\u53F7\u4E0E\u5BC6\u94A5\u3001\u4ED8\u8D39\u3001\u9700\u8981\u7532\u65B9\u62CD\u677F\u7684\u51B3\u5B9A\uFF09\u65F6\uFF0C\u624D\u505C\u4E0B\u5E76\u5728 needsUser \u4E2D\u5199\u6E05\u9700\u8981\u7532\u65B9\u505A\u4EC0\u4E48\u3001\u505A\u5B8C\u540E\u600E\u6837\u56DE\u590D\u4F60\uFF1B\u6B64\u65F6 message \u7B80\u8FF0\u5DF2\u5B8C\u6210\u7684\u8FDB\u5C55\uFF0Cfiles \u548C handoffs \u7559\u7A7A\u3002\u7532\u65B9\u56DE\u590D\u540E\u4F60\u4F1A\u5728\u540C\u4E00\u4F1A\u8BDD\u4E2D\u7EE7\u7EED\u3002\u5176\u4ED6\u60C5\u51B5 needsUser \u5FC5\u987B\u4E3A ""\u3002';
var meetingChainLimit = 6;
var liveCheckedActions = /* @__PURE__ */ new Set([
  "createMeeting",
  "updateMeeting",
  "meetingMessage",
  "stopMeeting",
  "draftMinutes",
  "saveMinutes",
  "resumeMeeting",
  "reviewMinutes",
  "meetingProject",
  "closeMeeting"
]);
function identity(input) {
  const schema = z2.object({ id: z2.string().min(1).required() });
  return z2.resolve(input, schema, {})[0].id;
}
function freshState() {
  return {
    version: 5,
    revision: 0,
    workspaces: [],
    activeWorkspaceId: null,
    employees: [],
    projects: [],
    tasks: [],
    messages: [],
    artifacts: [],
    meetings: [],
    templates: defaultTemplates()
  };
}
function within(root, path) {
  const rel = relative2(root, path);
  return rel !== ".." && !rel.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute2(rel);
}
var Studio = class _Studio {
  constructor(config, executor) {
    this.config = config;
    this.executor = executor;
  }
  config;
  executor;
  state = freshState();
  serial = Promise.resolve();
  active = /* @__PURE__ */ new Map();
  meetingRuns = /* @__PURE__ */ new Map();
  /** Latest progress line of each running task; transient, so it never advances the revision. */
  live = /* @__PURE__ */ new Map();
  closing = false;
  /** Open one local Studio and mark interrupted work without silently restarting it.
   * @param config - Persistence and scheduling configuration.
   * @param executor - Native execution provider.
   * @returns Ready Studio.
   */
  static async open(config, executor) {
    const studio = new _Studio(config, executor);
    await mkdir3(config.storageRoot, { recursive: true, mode: 448 });
    const read = async (name2) => {
      try {
        return JSON.parse(await readFile2(join3(config.storageRoot, name2), "utf8"));
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") return void 0;
        throw error;
      }
    };
    const journals = [
      ["studio.v5.json", parseState],
      ["studio.v4.json", migrateStateV4],
      ["studio.v3.json", migrateStateV3],
      ["studio.v2.json", migrateStateV2],
      ["studio.v1.json", migrateStateV1]
    ];
    for (const [name2, load] of journals) {
      const content = await read(name2);
      if (content === void 0) continue;
      studio.state = load(content);
      break;
    }
    for (const task of studio.state.tasks) {
      if (task.status === "running") {
        task.status = "interrupted";
        task.error = "Host stopped before the employee completed. Retry explicitly; existing file changes remain.";
        task.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
      }
    }
    for (const project of studio.state.projects) if (project.status === "running") project.status = "paused";
    for (const meeting2 of studio.state.meetings) {
      if (meeting2.speaking !== null || meeting2.status === "drafting") {
        meeting2.error = "Host stopped during a meeting turn. Send a message or draft the minutes again.";
        meeting2.speaking = null;
        if (meeting2.status === "drafting") meeting2.status = "open";
      }
      meeting2.queue = [];
    }
    await studio.persist();
    return studio;
  }
  /** Read a detached company snapshot.
   * @returns Public records only.
   */
  snapshot() {
    return structuredClone(this.state);
  }
  /** Read the latest progress line of each running task.
   * @returns Task id to the employee's most recent interim message.
   */
  progress() {
    return Object.fromEntries(this.live);
  }
  enqueue(action) {
    const next = this.serial.then(action);
    this.serial = next.catch(() => {
    });
    return next;
  }
  async persist() {
    const path = join3(this.config.storageRoot, "studio.v5.json");
    await writeFileAtomic(path, `${JSON.stringify(this.state, null, 2)}
`, { mode: 384, dirMode: 448 });
  }
  async commit() {
    this.state.revision += 1;
    await this.persist();
  }
  employee(id2) {
    const employee = this.state.employees.find((value) => value.id === id2);
    if (!employee) throw new Error("Employee does not exist");
    return employee;
  }
  project(id2) {
    const project = this.state.projects.find((value) => value.id === id2);
    if (!project) throw new Error("Project does not exist");
    return project;
  }
  template(id2) {
    const template = this.state.templates.find((value) => value.id === id2);
    if (!template) throw new Error("Team template does not exist");
    return template;
  }
  meeting(id2) {
    const meeting2 = this.state.meetings.find((value) => value.id === id2);
    if (!meeting2) throw new Error("Meeting does not exist");
    return meeting2;
  }
  task(id2) {
    const task = this.state.tasks.find((value) => value.id === id2);
    if (!task) throw new Error("Task does not exist");
    return task;
  }
  appendTask(project, employee, title, instruction, dependsOn, outputFiles) {
    if (this.state.tasks.filter((task2) => task2.projectId === project.id).length >= this.config.maxTasksPerProject) throw new Error("Project task limit reached");
    const task = {
      id: randomUUID3(),
      projectId: project.id,
      employeeId: employee.id,
      title,
      instruction,
      dependsOn,
      outputFiles: outputFiles.map(outputName),
      status: "pending",
      attempt: 0,
      result: "",
      error: "",
      assignment: "",
      startedAt: "",
      finishedAt: "",
      nativeSessions: [],
      reviewStatus: "pending",
      question: "",
      reply: ""
    };
    this.state.tasks.push(task);
    return task;
  }
  /** Apply one revision-checked UI command and persist before scheduling.
   * @param raw - Parsed request JSON validated here.
   * @returns Committed public snapshot.
   */
  command(raw) {
    return this.enqueue(async () => {
      if (this.closing) throw new Error("Studio is stopping");
      const command = parseFields(commandSchema, raw);
      if (command.expectedRevision !== this.state.revision && !liveCheckedActions.has(command.action)) throw new Error("Studio changed; refresh and retry your edit");
      const before = this.snapshot();
      try {
        switch (command.action) {
          case "createWorkspace": {
            const input = parseFields(z2.object({ name: z2.string().min(1).max(500).required(), path: z2.string().required() }), command.input);
            if (!isAbsolute2(input.path) || !(await stat(input.path)).isDirectory()) throw new Error("Company workspace must be an existing absolute directory");
            const path = await realpath2(input.path);
            const existing = this.state.workspaces.find((value) => value.path === path);
            if (existing) this.state.activeWorkspaceId = existing.id;
            else {
              const workspace = { id: randomUUID3(), name: input.name, path, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
              this.state.workspaces.push(workspace);
              this.state.activeWorkspaceId = workspace.id;
            }
            break;
          }
          case "selectWorkspace": {
            const id2 = identity(command.input);
            const workspace = this.state.workspaces.find((value) => value.id === id2);
            if (!workspace) throw new Error("Company workspace does not exist");
            this.state.activeWorkspaceId = workspace.id;
            break;
          }
          case "applyTemplate": {
            const template = this.template(identity(command.input));
            const plan = planTemplate(this.state, template);
            const affected = new Set([...plan.remove, ...plan.disable].map((employee) => employee.id));
            if ([...this.active.values()].some((run) => affected.has(run.employeeId)) || this.state.meetings.some((meeting2) => meeting2.speaking !== null && affected.has(meeting2.speaking))) {
              throw new Error("Stop running tasks and meeting turns of employees leaving the team first");
            }
            const removed = new Set(plan.remove.map((employee) => employee.id));
            this.state.employees = this.state.employees.filter((employee) => !removed.has(employee.id));
            for (const employee of this.state.employees) {
              if (plan.disable.some((value) => value.id === employee.id)) employee.enabled = false;
              if (plan.keep.some((value) => value.id === employee.id)) employee.enabled = true;
            }
            for (const meeting2 of this.state.meetings) meeting2.queue = meeting2.queue.filter((id2) => !affected.has(id2));
            this.state.employees.push(...plan.add.map((member) => ({ ...member, id: randomUUID3(), cwd: "", enabled: true })));
            break;
          }
          case "saveTemplate": {
            const input = parseFields(templateSchema, command.input);
            if (!input.name.trim() || !input.members.length) throw new Error("A team template needs a name and at least one member");
            if (input.members.length > 50) throw new Error("A team template can have at most 50 members");
            for (const member of input.members) validateMember(member);
            const existing = this.state.templates.find((value) => value.id === input.id);
            if (existing) Object.assign(existing, { name: input.name, description: input.description, members: input.members });
            else this.state.templates.push({ ...input, id: input.id, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
            break;
          }
          case "deleteTemplate": {
            const id2 = identity(command.input);
            this.template(id2);
            this.state.templates = this.state.templates.filter((value) => value.id !== id2);
            break;
          }
          case "deleteEmployees": {
            const ids = [...new Set(parseFields(z2.object({ ids: z2.array(z2.string()).required() }), command.input).ids)];
            for (const id2 of ids) {
              this.employee(id2);
              if (hasHistory(this.state, id2)) throw new Error("Employees with task or meeting history can be disabled but cannot be deleted");
            }
            this.state.employees = this.state.employees.filter((employee) => !ids.includes(employee.id));
            break;
          }
          case "saveEmployee": {
            const parsed = parseFields(employeeSchema, command.input);
            validateEmployee(parsed);
            if (parsed.cwd) {
              if (!(await stat(parsed.cwd)).isDirectory()) throw new Error("Employee working directory must exist");
              parsed.cwd = await realpath2(parsed.cwd);
            }
            if ([...this.active.values()].some((run) => run.employeeId === parsed.id)) throw new Error("Stop the employee task before changing its settings");
            if (this.state.meetings.some((meeting2) => meeting2.speaking === parsed.id)) throw new Error("Wait until the employee finishes speaking before changing its settings");
            const index = this.state.employees.findIndex((employee) => employee.id === parsed.id);
            if (index < 0) this.state.employees.push(parsed);
            else this.state.employees[index] = parsed;
            break;
          }
          case "deleteEmployee": {
            const id2 = identity(command.input);
            this.employee(id2);
            if (this.state.tasks.some((task) => task.employeeId === id2)) throw new Error("An employee with task history can be disabled but cannot be deleted");
            if (this.state.meetings.some((meeting2) => meeting2.attendeeIds.includes(id2) || meeting2.messages.some((message) => message.from === id2) || meeting2.minutes?.tasks.some((task) => task.employeeId === id2))) throw new Error("An employee with meeting history can be disabled but cannot be deleted");
            this.state.employees = this.state.employees.filter((employee) => employee.id !== id2);
            break;
          }
          case "createProject": {
            const input = parseFields(projectInput, command.input);
            const employees = [...new Set(input.employeeIds)].map((id2) => this.employee(id2));
            await this.newProject(input, employees.map((employee) => ({
              employee,
              title: `${employee.role} \xB7 ${input.name}`,
              instruction: `\u5B8C\u6210\u4F60\u7684\u5C97\u4F4D\u8D1F\u8D23\u7684\u5DE5\u4F5C\uFF0C\u4F7F\u7528\u5DF2\u4EA4\u63A5\u7684\u6587\u6863\u548C\u7ED3\u679C\u3002\u76EE\u6807\uFF1A${input.objective}`
            })));
            break;
          }
          case "createMeeting": {
            const input = parseFields(z2.object({ ...meetingFields, workspaceId: z2.string().required() }), command.input);
            const workspace = this.state.workspaces.find((value) => value.id === input.workspaceId);
            if (!workspace) throw new Error("Select a company workspace first");
            this.state.meetings.push({
              id: randomUUID3(),
              workspaceId: workspace.id,
              title: input.title,
              agenda: input.agenda,
              hostId: input.hostId,
              attendeeIds: this.attendees(input.hostId, input.attendeeIds),
              status: "open",
              queue: [],
              speaking: null,
              error: "",
              messages: [],
              minutes: null,
              projectId: null,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            });
            break;
          }
          case "updateMeeting": {
            const input = parseFields(z2.object({ ...meetingFields, id: z2.string().required() }), command.input);
            const meeting2 = this.meeting(input.id);
            if (meeting2.status === "closed") throw new Error("The meeting has ended");
            const attendees = this.attendees(input.hostId, input.attendeeIds);
            if (meeting2.speaking && !attendees.includes(meeting2.speaking)) throw new Error("Wait until the current speaker finishes");
            Object.assign(meeting2, {
              title: input.title,
              agenda: input.agenda,
              hostId: input.hostId,
              attendeeIds: attendees,
              queue: meeting2.queue.filter((id2) => attendees.includes(id2))
            });
            break;
          }
          case "meetingMessage": {
            const input = parseFields(meetingMessageInput, command.input);
            const meeting2 = this.meeting(input.id);
            if (meeting2.status !== "open") throw new Error("The meeting is not open for discussion");
            const mentions = [...new Set(input.mentions)];
            if (mentions.some((id2) => !meeting2.attendeeIds.includes(id2))) throw new Error("Mention only meeting attendees");
            meeting2.messages.push({
              id: randomUUID3(),
              from: "user",
              message: input.message,
              mentions,
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              nativeSession: null
            });
            meeting2.queue = [.../* @__PURE__ */ new Set([...meeting2.queue, ...mentions.length ? mentions : [meeting2.hostId]])];
            meeting2.error = "";
            break;
          }
          case "stopMeeting": {
            const meeting2 = this.meeting(identity(command.input));
            meeting2.queue = [];
            this.meetingRuns.get(meeting2.id)?.controller.abort(new Error("Stopped by user"));
            break;
          }
          case "draftMinutes": {
            const meeting2 = this.meeting(identity(command.input));
            if (meeting2.projectId !== null) throw new Error("This meeting already created a project");
            if (meeting2.status === "drafting") throw new Error("The minutes are already being drafted");
            if (this.meetingRuns.has(meeting2.id)) throw new Error("Wait for the current speaker or stop the turn first");
            if (!meeting2.messages.length) throw new Error("Discuss something before drafting minutes");
            meeting2.status = "drafting";
            meeting2.queue = [];
            meeting2.error = "";
            break;
          }
          case "saveMinutes": {
            const input = parseFields(z2.object({ id: z2.string().required(), minutes: minutesSchema.required() }), command.input);
            const meeting2 = this.meeting(input.id);
            if (meeting2.status !== "review") throw new Error("Minutes can be edited only while awaiting confirmation");
            for (const task of input.minutes.tasks) this.employee(task.employeeId);
            meeting2.minutes = input.minutes;
            meeting2.error = "";
            break;
          }
          case "resumeMeeting": {
            const meeting2 = this.meeting(identity(command.input));
            if (meeting2.status !== "review" && !(meeting2.status === "closed" && meeting2.projectId === null)) {
              throw new Error("Only meetings awaiting minutes confirmation or ended without a project can resume");
            }
            meeting2.status = "open";
            meeting2.error = "";
            break;
          }
          case "reviewMinutes": {
            const meeting2 = this.meeting(identity(command.input));
            if (meeting2.status !== "closed" || meeting2.projectId !== null || !meeting2.minutes) throw new Error("Only ended meetings with minutes and no project can reopen their minutes");
            meeting2.status = "review";
            break;
          }
          case "meetingProject": {
            const input = parseFields(z2.object({
              id: z2.string().required(),
              minutes: minutesSchema.required(),
              cwd: z2.string().required(),
              sessionMode: z2.union(["employee-project", "new-task"]).required()
            }), command.input);
            const meeting2 = this.meeting(input.id);
            if (meeting2.status !== "review") throw new Error("Confirm the meeting minutes first");
            const minutes = input.minutes;
            if (!minutes.projectName.trim() || !minutes.objective.trim()) throw new Error("Minutes need a project name and objective");
            if (!minutes.tasks.length || minutes.tasks.some((task) => !task.title.trim() || !task.instruction.trim())) throw new Error("Minutes need at least one complete task");
            const project = await this.newProject(
              {
                name: minutes.projectName,
                objective: minutes.objective,
                cwd: input.cwd,
                workspaceId: meeting2.workspaceId,
                acceptanceCriteria: minutes.acceptanceCriteria,
                sessionMode: input.sessionMode
              },
              minutes.tasks.map((task) => ({ employee: this.employee(task.employeeId), title: task.title, instruction: task.instruction }))
            );
            this.state.messages.push({
              id: randomUUID3(),
              projectId: project.id,
              taskId: null,
              from: "user",
              to: "team",
              message: [`\u4F1A\u8BAE\u7EAA\u8981\uFF1A${meeting2.title}`, minutes.summary, ...minutes.decisions.map((value) => `- ${value}`)].filter(Boolean).join("\n"),
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            });
            Object.assign(meeting2, { minutes, status: "closed", projectId: project.id, queue: [], error: "" });
            break;
          }
          case "closeMeeting": {
            const meeting2 = this.meeting(identity(command.input));
            meeting2.status = "closed";
            meeting2.queue = [];
            this.meetingRuns.get(meeting2.id)?.controller.abort(new Error("Meeting ended"));
            break;
          }
          case "createTask": {
            const input = parseFields(taskInput, command.input);
            const project = this.project(input.projectId);
            const dependencies = [...new Set(input.dependsOn)].map((id2) => this.task(id2));
            if (dependencies.some((task) => task.projectId !== project.id)) throw new Error("Task dependencies must belong to this project");
            const employee = this.employee(input.employeeId);
            if (!employee.enabled) throw new Error("Employee is disabled");
            this.appendTask(project, employee, input.title, input.instruction, dependencies.map((task) => task.id), input.outputFiles);
            if (project.status === "completed") project.status = "paused";
            break;
          }
          case "editTask": {
            const input = parseFields(z2.object({ id: z2.string().required(), task: taskInput.required() }), command.input);
            const task = this.task(input.id);
            if (task.status !== "pending") throw new Error("Only pending tasks can be edited");
            if (input.task.projectId !== task.projectId) throw new Error("Tasks cannot move between projects");
            this.employee(input.task.employeeId);
            const dependencies = [...new Set(input.task.dependsOn)].map((id2) => this.task(id2));
            const reaches = (id2, visited = /* @__PURE__ */ new Set()) => {
              if (id2 === task.id) return true;
              if (visited.has(id2)) return false;
              visited.add(id2);
              return this.task(id2).dependsOn.some((next) => reaches(next, visited));
            };
            if (dependencies.some((dependency) => dependency.projectId !== task.projectId || reaches(dependency.id))) throw new Error("Task dependencies must be in this project and cannot form a cycle");
            if (input.task.employeeId !== task.employeeId) task.error = "";
            Object.assign(task, {
              employeeId: input.task.employeeId,
              title: input.task.title,
              instruction: input.task.instruction,
              dependsOn: dependencies.map((dependency) => dependency.id),
              outputFiles: input.task.outputFiles.map(outputName)
            });
            break;
          }
          case "startProject": {
            const project = this.project(identity(command.input));
            if (!this.state.tasks.some((task) => task.projectId === project.id && task.status === "pending")) throw new Error("Project has no pending tasks");
            project.status = "running";
            break;
          }
          case "acceptProject": {
            const project = this.project(identity(command.input));
            const tasks = this.state.tasks.filter((task) => task.projectId === project.id);
            if (!tasks.length || tasks.some((task) => task.status !== "completed")) throw new Error("Every task must complete before project acceptance");
            for (const task of tasks) if (task.reviewStatus === "pending") task.reviewStatus = "accepted";
            project.status = "completed";
            break;
          }
          case "requestChanges": {
            const input = parseFields(z2.object({
              id: z2.string().required(),
              instruction: z2.string().min(1).max(1e5).required()
            }), command.input);
            const original = this.task(input.id);
            const project = this.project(original.projectId);
            if (original.status !== "completed" || original.reviewStatus === "superseded") {
              throw new Error("Select a completed task awaiting review");
            }
            if ([...this.active.keys()].some((id2) => this.task(id2).projectId === project.id)) throw new Error("Stop the project before requesting changes");
            const repair = this.appendTask(
              project,
              this.employee(original.employeeId),
              original.title,
              input.instruction,
              [original.id],
              [...original.outputFiles]
            );
            for (const task of this.state.tasks) {
              if (task.status === "pending" && task.id !== repair.id) task.dependsOn = task.dependsOn.map((id2) => id2 === original.id ? repair.id : id2);
            }
            original.reviewStatus = "superseded";
            project.status = "paused";
            this.state.messages.push({
              id: randomUUID3(),
              projectId: project.id,
              taskId: repair.id,
              from: "user",
              to: original.employeeId,
              message: input.instruction,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            });
            break;
          }
          case "exportProject": {
            const project = this.project(identity(command.input));
            await exportProject(this.state, project, this.config.storageRoot);
            break;
          }
          case "pauseProject":
            this.project(identity(command.input)).status = "paused";
            break;
          case "stopProject": {
            const project = this.project(identity(command.input));
            project.status = "paused";
            for (const task of this.state.tasks) if (task.projectId === project.id) this.active.get(task.id)?.controller.abort(new Error("Stopped by user"));
            break;
          }
          case "retryTask": {
            const task = this.task(identity(command.input));
            if (!["failed", "cancelled", "interrupted"].includes(task.status)) throw new Error("Only failed, cancelled, or interrupted tasks can be retried");
            task.status = "pending";
            task.result = "";
            if (this.project(task.projectId).status === "completed") this.project(task.projectId).status = "paused";
            break;
          }
          case "cancelTask": {
            const task = this.task(identity(command.input));
            if (task.status === "running") this.active.get(task.id)?.controller.abort(new Error("Stopped by user"));
            else if (task.status === "pending" || task.status === "waiting") {
              task.status = "cancelled";
              task.reply = "";
              task.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
            } else throw new Error("Task is not pending, running, or waiting");
            break;
          }
          case "answerTask": {
            const input = parseFields(answerInput, command.input);
            const task = this.task(input.id);
            if (task.status !== "waiting") throw new Error("The employee is not waiting for you on this task");
            task.status = "pending";
            task.reply = input.reply;
            task.error = "";
            this.state.messages.push({
              id: randomUUID3(),
              projectId: task.projectId,
              taskId: task.id,
              from: "user",
              to: task.employeeId,
              message: input.reply,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            });
            break;
          }
          case "message": {
            const input = parseFields(messageInput, command.input);
            const project = this.project(input.projectId);
            if (input.to !== "team") this.employee(input.to);
            this.state.messages.push({
              id: randomUUID3(),
              projectId: project.id,
              taskId: null,
              from: "user",
              to: input.to,
              message: input.message,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            });
            break;
          }
          default:
            throw new Error(`Unknown Studio action: ${command.action}`);
        }
        await this.commit();
      } catch (error) {
        this.state = before;
        throw error;
      }
      this.schedule();
      this.scheduleMeetings();
      return this.snapshot();
    });
  }
  attendees(hostId, ids) {
    const attendees = [.../* @__PURE__ */ new Set([hostId, ...ids])].map((id2) => this.employee(id2));
    if (attendees.some((employee) => !employee.enabled)) throw new Error("Invite only enabled employees");
    return attendees.map((employee) => employee.id);
  }
  /** Validate directory and team, then append a paused project whose tasks form a sequential chain. */
  async newProject(input, assignments) {
    const workspace = this.state.workspaces.find((value) => value.id === input.workspaceId);
    if (!workspace) throw new Error("Select a company workspace first");
    const directory = input.cwd || workspace.path;
    if (!isAbsolute2(directory) || !(await stat(directory)).isDirectory()) throw new Error("Project working directory must be an existing absolute directory");
    const cwd = await realpath2(directory);
    if (!withinDirectory(workspace.path, cwd)) throw new Error("Project directory must stay inside the company workspace");
    if (!assignments.length || assignments.some((value) => !value.employee.enabled)) throw new Error("Select at least one enabled employee");
    if (assignments.length > this.config.maxTasksPerProject) throw new Error("Team exceeds the project task limit");
    const project = {
      id: randomUUID3(),
      name: input.name,
      objective: input.objective,
      cwd,
      workspaceId: workspace.id,
      acceptanceCriteria: input.acceptanceCriteria,
      sessionMode: input.sessionMode,
      status: "paused",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.state.projects.push(project);
    let previous;
    for (const { employee, title, instruction } of assignments) {
      const task = this.appendTask(project, employee, title, instruction, previous ? [previous.id] : [], []);
      if (employee.permission !== "read-only") task.outputFiles = [`.studio-deliverables/${task.id}.md`];
      previous = task;
    }
    return project;
  }
  meetingPrompt(meeting2, employee, drafting) {
    const name2 = (id2) => id2 === "user" ? "\u7532\u65B9\uFF08\u7528\u6237\uFF09" : this.state.employees.find((value) => value.id === id2)?.name ?? id2;
    const header = [
      `\u4F60\u662F\u8F6F\u4EF6\u516C\u53F8\u7684\u5458\u5DE5 ${employee.name}\uFF0C\u5C97\u4F4D\uFF1A${employee.role}\u3002\u804C\u8D23\uFF1A${employee.responsibilities}`,
      `\u4F60\u6B63\u5728\u53C2\u52A0\u4F1A\u8BAE\u300C${meeting2.title}\u300D\u3002${meeting2.hostId === employee.id ? "\u4F60\u662F\u672C\u6B21\u4F1A\u8BAE\u4E3B\u6301\u4EBA\uFF1A\u5F15\u5BFC\u8BA8\u8BBA\uFF0C\u6F84\u6E05\u7532\u65B9\u9700\u6C42\uFF0C\u5FC5\u8981\u65F6\u70B9\u540D\u5408\u9002\u7684\u540C\u4E8B\u53D1\u8A00\u3002" : `\u4E3B\u6301\u4EBA\u662F ${name2(meeting2.hostId)}\u3002`}`,
      `\u4F1A\u8BAE\u8BAE\u9898\uFF1A${meeting2.agenda || "\uFF08\u672A\u586B\u5199\uFF0C\u6309\u8BA8\u8BBA\u5185\u5BB9\u63A8\u8FDB\uFF09"}`,
      "\u7532\u65B9\uFF08\u7528\u6237\uFF09\u662F\u63D0\u51FA\u9700\u6C42\u7684\u5BA2\u6237\u3002\u4F1A\u8BAE\u53EA\u8BA8\u8BBA\uFF0C\u4E0D\u5199\u4EE3\u7801\uFF0C\u4E0D\u4FEE\u6539\u4EFB\u4F55\u6587\u4EF6\u3002",
      `\u53C2\u4F1A\u8005\uFF1A${JSON.stringify(meeting2.attendeeIds.map((id2) => ({ employeeId: id2, name: name2(id2), role: this.employee(id2).role, host: id2 === meeting2.hostId })))}`
    ].join("\n\n");
    const instruction = drafting ? [
      "\u8BA8\u8BBA\u5DF2\u7ED3\u675F\u3002\u8BF7\u4F5C\u4E3A\u4E3B\u6301\u4EBA\u6574\u7406\u4F1A\u8BAE\u7EAA\u8981\uFF0C\u4F9B\u7532\u65B9\u786E\u8BA4\u540E\u76F4\u63A5\u5EFA\u7ACB\u9879\u76EE\u3002",
      '\u4EC5\u8FD4\u56DE JSON\uFF1A{"message":"<\u7EAA\u8981 JSON \u5B57\u7B26\u4E32>","files":[],"handoffs":[]}\u3002message \u5FC5\u987B\u662F\u4E00\u4E2A JSON \u5B57\u7B26\u4E32\uFF0C\u7ED3\u6784\u4E3A\uFF1A',
      '{"summary":"\u4F1A\u8BAE\u7ED3\u8BBA\u6982\u8FF0","decisions":["\u5DF2\u786E\u5B9A\u7684\u9700\u6C42\u6216\u51B3\u5B9A"],"projectName":"\u9879\u76EE\u540D\u79F0","objective":"\u9879\u76EE\u76EE\u6807","acceptanceCriteria":"\u9010\u6761\u9A8C\u6536\u6807\u51C6","tasks":[{"employeeId":"\u53C2\u4F1A\u8005\u771F\u5B9E employeeId","title":"\u4EFB\u52A1\u6807\u9898","instruction":"\u5177\u4F53\u4EFB\u52A1\u5B89\u6392"}]}',
      "tasks \u6309\u4EA4\u4ED8\u987A\u5E8F\u6392\u5217\uFF0C\u6BCF\u9879\u4EA4\u7ED9\u6700\u5408\u9002\u7684\u53C2\u4F1A\u8005\u3002\u4E0D\u5F97\u5305\u542B\u63A8\u7406\u8FC7\u7A0B\u3002"
    ].join("\n") : [
      "\u73B0\u5728\u8F6E\u5230\u4F60\u53D1\u8A00\u3002\u8BF7\u4EE5\u4F60\u7684\u5C97\u4F4D\u89C6\u89D2\uFF0C\u50CF\u4F1A\u8BAE\u4E2D\u90A3\u6837\u7B80\u6D01\u5730\u53E3\u5934\u53D1\u8A00\uFF1A\u56DE\u5E94\u6700\u65B0\u7684\u95EE\u9898\uFF0C\u63D0\u51FA\u9700\u8981\u7532\u65B9\u6F84\u6E05\u7684\u95EE\u9898\u3001\u98CE\u9669\u3001\u4F30\u7B97\u6216\u5EFA\u8BAE\u3002",
      '\u4EC5\u8FD4\u56DE JSON\uFF1A{"message":"\u4F60\u7684\u53D1\u8A00","files":[],"handoffs":[{"employeeId":"\u9700\u8981\u63A5\u7740\u53D1\u8A00\u7684\u53C2\u4F1A\u540C\u4E8B employeeId","message":"\u60F3\u8BF7\u4ED6\u56DE\u7B54\u7684\u95EE\u9898"}]}\u3002\u4E0D\u9700\u8981\u522B\u4EBA\u63A5\u8BDD\u65F6 handoffs \u4E3A []\u3002\u4E0D\u5F97\u5305\u542B\u63A8\u7406\u8FC7\u7A0B\u3001\u601D\u8003\u65E5\u5FD7\u6216\u5DE5\u5177\u8C03\u7528\u8F68\u8FF9\u3002'
    ].join("\n");
    const budget = this.config.maxTextBytes - Buffer.byteLength(header) - Buffer.byteLength(instruction) - 1024;
    const transcript = [];
    let used = 0;
    for (const message of [...meeting2.messages].reverse()) {
      const entry = { speaker: name2(message.from), message: message.message };
      const bytes = Buffer.byteLength(JSON.stringify(entry));
      if (used + bytes > budget) break;
      transcript.unshift(entry);
      used += bytes;
    }
    if (!transcript.length && meeting2.messages.length) throw new Error("The latest meeting message exceeds the configured text limit");
    const omitted = meeting2.messages.length - transcript.length;
    return [header, `\u4F1A\u8BAE\u8BB0\u5F55\uFF08\u6309\u65F6\u95F4\u987A\u5E8F${omitted ? `\uFF0C\u7701\u7565\u6700\u65E9\u7684 ${omitted} \u6761` : ""}\uFF09\uFF1A${JSON.stringify(transcript)}`, instruction].join("\n\n");
  }
  scheduleMeetings() {
    if (this.closing) return;
    for (const meeting2 of this.state.meetings) {
      if (this.meetingRuns.has(meeting2.id)) continue;
      if (meeting2.status !== "drafting" && !(meeting2.status === "open" && meeting2.queue.length)) continue;
      const controller = new AbortController();
      const run = { controller, done: Promise.resolve() };
      this.meetingRuns.set(meeting2.id, run);
      run.done = this.meetingTurn(meeting2.id, controller).finally(() => {
        this.meetingRuns.delete(meeting2.id);
        this.scheduleMeetings();
      });
      void run.done.catch((error) => {
        console.error("Studio could not persist a meeting turn:", error instanceof Error ? error.message : "unknown error");
      });
    }
  }
  /** Run one speaker, or the host's minutes, through the employee's own engine: read-only, in the company directory. */
  async meetingTurn(id2, controller) {
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort(new Error("Meeting turn timeout reached"));
    }, this.config.taskTimeoutMs);
    try {
      const prepared = await this.enqueue(async () => {
        const meeting3 = this.meeting(id2);
        const drafting2 = meeting3.status === "drafting";
        const speaker = drafting2 ? meeting3.hostId : meeting3.queue[0];
        if (!speaker || controller.signal.aborted || this.closing) return null;
        const employee2 = this.employee(speaker);
        const workspace = this.state.workspaces.find((value) => value.id === meeting3.workspaceId);
        if (!workspace) throw new Error("Company workspace does not exist");
        const cwd2 = await realpath2(workspace.path);
        const prompt2 = this.meetingPrompt(meeting3, employee2, drafting2);
        if (!drafting2) meeting3.queue.shift();
        meeting3.speaking = speaker;
        meeting3.error = "";
        await this.commit();
        return { meeting: structuredClone(meeting3), employee: structuredClone(employee2), cwd: cwd2, drafting: drafting2, prompt: prompt2 };
      });
      if (!prepared) return;
      const { meeting: meeting2, employee, cwd, drafting, prompt } = prepared;
      let session = null;
      try {
        const project = {
          id: meeting2.id,
          workspaceId: meeting2.workspaceId,
          name: `\u4F1A\u8BAE \xB7 ${meeting2.title}`,
          objective: meeting2.agenda,
          cwd,
          status: "running",
          acceptanceCriteria: "",
          sessionMode: "new-task",
          createdAt: meeting2.createdAt
        };
        const task = {
          id: randomUUID3(),
          projectId: project.id,
          employeeId: employee.id,
          title: meeting2.title,
          instruction: prompt,
          dependsOn: [],
          outputFiles: [],
          status: "running",
          attempt: 1,
          result: "",
          error: "",
          startedAt: (/* @__PURE__ */ new Date()).toISOString(),
          finishedAt: "",
          assignment: prompt,
          nativeSessions: [],
          reviewStatus: "pending",
          question: "",
          reply: ""
        };
        const result = await this.executor.run({ ...employee, permission: "read-only", cwd: "" }, project, task, controller.signal, {
          resumeSessionId: null,
          recordSession: (sessionId) => {
            if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(sessionId)) return Promise.reject(new Error("Native session identity is invalid"));
            session = { id: sessionId, engine: employee.engine, cwd, attempt: 1, continued: false };
            return Promise.resolve();
          }
        });
        controller.signal.throwIfAborted();
        await this.enqueue(async () => {
          const live = this.meeting(id2);
          const createdAt = (/* @__PURE__ */ new Date()).toISOString();
          live.speaking = null;
          if (drafting) {
            const { minutes, parsed } = parseMinutes(result.message, live);
            live.minutes = minutes;
            live.status = "review";
            live.error = parsed ? "" : "The host did not return structured minutes. The original text is kept; add the project details and tasks before creating the project.";
            live.messages.push({ id: randomUUID3(), from: employee.id, message: minutes.summary, mentions: [], createdAt, nativeSession: session });
          } else {
            const sinceUser = live.messages.length - 1 - live.messages.findLastIndex((message) => message.from === "user");
            const mentions = [...new Set(result.handoffs.map((handoff) => handoff.employeeId))].filter((value) => value !== employee.id && live.attendeeIds.includes(value));
            live.messages.push({ id: randomUUID3(), from: employee.id, message: result.message, mentions, createdAt, nativeSession: session });
            if (live.status === "open" && sinceUser + 1 < meetingChainLimit) live.queue = [.../* @__PURE__ */ new Set([...live.queue, ...mentions])];
          }
          await this.commit();
        });
      } catch (error) {
        await this.enqueue(async () => {
          const live = this.state.meetings.find((value) => value.id === id2);
          if (!live) return;
          live.speaking = null;
          live.queue = [];
          if (live.status === "drafting") live.status = "open";
          live.error = timedOut ? "Meeting turn timeout reached" : controller.signal.aborted ? `${employee.name} was stopped` : `${employee.name}: ${error instanceof Error ? error.message : "meeting turn failed"}`;
          await this.commit();
        });
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  assignment(employee, project, task) {
    const dependencies = task.dependsOn.map((id2) => this.task(id2));
    const messages = this.state.messages.filter((message) => message.projectId === project.id && (message.to === employee.id || message.to === "team") && (message.taskId === null || message.to === employee.id));
    const artifacts = this.state.artifacts.filter((file) => dependencies.some((dependency) => dependency.id === file.taskId));
    const prompt = [
      `\u4F60\u662F\u8F6F\u4EF6\u516C\u53F8\u7684\u5458\u5DE5 ${employee.name}\uFF0C\u5C97\u4F4D\uFF1A${employee.role}\u3002\u804C\u8D23\uFF1A${employee.responsibilities}`,
      `\u9879\u76EE\uFF1A${project.name}
\u9879\u76EE\u76EE\u6807\uFF1A${project.objective}
\u9A8C\u6536\u6807\u51C6\uFF1A${project.acceptanceCriteria}
\u5DE5\u4F5C\u76EE\u5F55\uFF1A${employee.cwd || project.cwd}`,
      `\u9886\u5BFC\u5B89\u6392\u7684\u4EFB\u52A1\uFF1A${task.title}
${task.instruction}`,
      ...task.reply ? [`\u4F60\u4E0A\u6B21\u6682\u505C\u6B64\u4EFB\u52A1\uFF0C\u8BF7\u7532\u65B9\u5904\u7406\uFF1A${task.question}
\u7532\u65B9\u56DE\u590D\uFF1A${task.reply}
\u8BF7\u636E\u6B64\u7EE7\u7EED\u3002`] : [],
      `\u56E2\u961F\u6210\u5458\uFF1A${JSON.stringify(this.state.employees.filter((value) => value.enabled).map((value) => ({ employeeId: value.id, name: value.name, role: value.role })))}`,
      `\u5DF2\u5B8C\u6210\u7684\u524D\u7F6E\u4EFB\u52A1\uFF1A${JSON.stringify(dependencies.map((value) => ({ title: value.title, message: value.result })))}`,
      `\u4EBA\u7C7B\u5BF9\u8BDD\u4E0E\u4EA4\u63A5\uFF1A${JSON.stringify(messages.map((value) => ({ from: value.from, message: value.message })))}`,
      `\u524D\u7F6E\u4EFB\u52A1\u7684\u7ED3\u679C\u6587\u4EF6\uFF08\u53EF\u8BFB\u53D6\uFF09\uFF1A${JSON.stringify(artifacts.map((file) => ({ name: file.name, path: join3(this.config.storageRoot, "artifacts", file.id), sha256: file.sha256 })))}`,
      `\u8BF7\u4EA4\u4ED8\u8FD9\u4E9B\u9879\u76EE\u76F8\u5BF9\u8DEF\u5F84\u7684\u6587\u4EF6\uFF1A${JSON.stringify(task.outputFiles)}\u3002\u5FC5\u8981\u65F6\u521B\u5EFA\u7236\u76EE\u5F55\u3002\u53EA\u4EA4\u4ED8\u4E0E\u4EFB\u52A1\u6709\u5173\u7684\u7ED3\u679C\uFF0C\u4E0D\u5BFC\u51FA\u4EFB\u4F55\u5DE5\u5177\u7684\u79C1\u6709\u4F1A\u8BDD\u3001\u51ED\u636E\u6216\u601D\u8003\u8FC7\u7A0B\u3002`,
      '\u5B8C\u6210\u540E\u4EC5\u8FD4\u56DE JSON\uFF1A{"message":"\u7ED9\u9886\u5BFC\u6216\u540C\u4E8B\u7684\u6700\u7EC8\u5DE5\u4F5C\u6C47\u62A5\uFF0C\u8BF4\u660E\u7ED3\u679C\u3001\u9A8C\u8BC1\u548C\u5269\u4F59\u95EE\u9898", "files":["\u5DF2\u5B8C\u6210\u7684\u9879\u76EE\u76F8\u5BF9\u8DEF\u5F84"], "handoffs":[{"employeeId":"\u63A5\u6536\u8005\u7684\u771F\u5B9E\u5458\u5DE5 id", "message":"\u7ED9\u540C\u4E8B\u7684\u4EFB\u52A1\u5B89\u6392\u6216\u7ED3\u679C\u8BF4\u660E"}], "needsUser":""}\u3002\u6CA1\u6709\u4EA4\u63A5\u65F6 handoffs \u4E3A []\u3002\u4E0D\u5F97\u5305\u542B\u63A8\u7406\u8FC7\u7A0B\u3001\u601D\u8003\u65E5\u5FD7\u6216\u5DE5\u5177\u8C03\u7528\u8F68\u8FF9\u3002',
      needsUserRule
    ].join("\n\n");
    if (Buffer.byteLength(prompt) > this.config.maxTextBytes) throw new Error("Assignment exceeds the configured text limit; reduce the task or its dependencies");
    return prompt;
  }
  /** Prompt that continues a waiting native session with the user's reply. */
  continuation(task) {
    return [
      `\u4F60\u4E4B\u524D\u6682\u505C\u4EFB\u52A1\u300C${task.title}\u300D\uFF0C\u8BF7\u7532\u65B9\u5904\u7406\uFF1A${task.question}`,
      `\u7532\u65B9\u56DE\u590D\uFF1A${task.reply}`,
      "\u8BF7\u5728\u6B64\u57FA\u7840\u4E0A\u7EE7\u7EED\u5B8C\u6210\u539F\u4EFB\u52A1\u3002\u5B8C\u6210\u540E\u4ECD\u6309\u539F\u6765\u7684 JSON \u683C\u5F0F\u8FD4\u56DE\uFF1B\u5982\u679C\u8FD8\u9700\u8981\u7532\u65B9\u5904\u7406\uFF0C\u518D\u6B21\u586B\u5199 needsUser\u3002",
      needsUserRule
    ].join("\n\n");
  }
  /** Prompt that continues a failed or interrupted native session; the working tree keeps everything already done. */
  recovery(task) {
    return [
      `\u4F60\u4E0A\u6B21\u6267\u884C\u4EFB\u52A1\u300C${task.title}\u300D\u65F6\u4E2D\u65AD\u4E86\uFF0C\u539F\u56E0\uFF1A${task.error}`,
      "\u5DE5\u4F5C\u76EE\u5F55\u4E2D\u5DF2\u5B8C\u6210\u7684\u6539\u52A8\u90FD\u8FD8\u5728\u3002\u8BF7\u5148\u68C0\u67E5\u5F53\u524D\u8FDB\u5EA6\uFF0C\u4E0D\u8981\u91CD\u505A\u5DF2\u7ECF\u5B8C\u6210\u7684\u5DE5\u4F5C\uFF0C\u7EE7\u7EED\u5B8C\u6210\u539F\u4EFB\u52A1\u3002\u5B8C\u6210\u540E\u6309\u539F\u6765\u7684 JSON \u683C\u5F0F\u8FD4\u56DE\u6700\u7EC8\u7ED3\u679C\u3002",
      needsUserRule
    ].join("\n\n");
  }
  schedule() {
    if (this.closing) return;
    for (const task of this.state.tasks) {
      if (this.active.size >= this.config.maxParallel) break;
      const project = this.project(task.projectId);
      if (project.status !== "running" || task.status !== "pending" || this.active.has(task.id)) continue;
      const employee = this.employee(task.employeeId);
      const cwd = resolve2(employee.cwd || project.cwd);
      if (!employee.enabled || [...this.active.values()].some((run2) => run2.cwd === cwd || run2.employeeId === employee.id)) continue;
      if (!task.dependsOn.every((id2) => this.task(id2).status === "completed")) continue;
      const controller = new AbortController();
      const run = { controller, done: Promise.resolve(), cwd, employeeId: employee.id };
      this.active.set(task.id, run);
      run.done = this.execute(task.id, controller).finally(() => {
        this.active.delete(task.id);
        this.schedule();
      });
      void run.done.catch((error) => {
        console.error("Studio could not persist task settlement:", error instanceof Error ? error.message : "unknown error");
      });
    }
  }
  async execute(id2, controller) {
    let timedOut = false;
    let captured = [];
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort(new Error("Task timeout reached"));
    }, this.config.taskTimeoutMs);
    try {
      const prepared = await this.enqueue(async () => {
        const task2 = this.task(id2);
        const employee2 = this.employee(task2.employeeId);
        const project2 = this.project(task2.projectId);
        if (controller.signal.aborted || this.closing || task2.status !== "pending" || project2.status !== "running") throw new Error("Task start was cancelled");
        const workspace = this.state.workspaces.find((value) => value.id === project2.workspaceId);
        if (!workspace) throw new Error("Company workspace does not exist");
        const cwd = await realpath2(employee2.cwd || project2.cwd);
        if (!withinDirectory(await realpath2(workspace.path), cwd)) throw new Error("Employee directory must stay inside the company workspace");
        const resumed2 = task2.reply || task2.error ? task2.nativeSessions.findLast((value) => value.engine === employee2.engine && value.cwd === (employee2.cwd || project2.cwd)) : void 0;
        task2.assignment = resumed2 ? task2.reply ? this.continuation(task2) : this.recovery(task2) : this.assignment(employee2, project2, task2);
        task2.status = "running";
        task2.attempt += 1;
        task2.startedAt = (/* @__PURE__ */ new Date()).toISOString();
        task2.finishedAt = "";
        task2.question = "";
        task2.reply = "";
        task2.error = "";
        await this.commit();
        return structuredClone({ task: task2, employee: employee2, project: project2, resumed: resumed2 });
      });
      const { task, employee, project, resumed } = prepared;
      const prior = resumed ?? (project.sessionMode === "employee-project" ? this.state.tasks.filter((value) => value.projectId === project.id && value.employeeId === employee.id && value.status === "completed").flatMap((value) => value.nativeSessions).findLast((value) => value.engine === employee.engine && value.cwd === (employee.cwd || project.cwd)) : void 0);
      const result = await this.executor.run(employee, project, task, controller.signal, {
        resumeSessionId: prior?.id ?? null,
        progress: (text2) => {
          this.live.set(id2, { text: text2, at: (/* @__PURE__ */ new Date()).toISOString() });
        },
        recordSession: (sessionId) => this.enqueue(async () => {
          if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/.test(sessionId)) throw new Error("Native session identity is invalid");
          const live = this.task(id2);
          if (!live.nativeSessions.some((value) => value.id === sessionId && value.attempt === live.attempt)) {
            live.nativeSessions.push({
              id: sessionId,
              engine: employee.engine,
              cwd: employee.cwd || project.cwd,
              attempt: live.attempt,
              continued: prior?.id === sessionId
            });
            await this.commit();
          }
        })
      });
      controller.signal.throwIfAborted();
      if (result.needsUser) {
        await this.enqueue(async () => {
          const live = this.task(id2);
          live.status = "waiting";
          live.question = result.needsUser;
          live.result = result.message;
          live.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
          await this.commit();
        });
        return;
      }
      for (const handoff of result.handoffs) this.employee(handoff.employeeId);
      const artifacts = await this.capture(employee, project, task, result);
      captured = artifacts;
      controller.signal.throwIfAborted();
      await this.enqueue(async () => {
        const before = this.snapshot();
        try {
          const live = this.task(id2);
          live.status = "completed";
          live.result = result.message;
          live.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
          this.state.artifacts.push(...artifacts);
          const createdAt = (/* @__PURE__ */ new Date()).toISOString();
          this.state.messages.push(
            {
              id: randomUUID3(),
              projectId: project.id,
              taskId: id2,
              from: employee.id,
              to: "team",
              message: result.message,
              createdAt
            },
            ...result.handoffs.map((handoff) => ({
              id: randomUUID3(),
              projectId: project.id,
              taskId: id2,
              from: employee.id,
              to: handoff.employeeId,
              message: handoff.message,
              createdAt
            }))
          );
          if (this.state.tasks.filter((value) => value.projectId === project.id).every((value) => value.status === "completed")) this.project(project.id).status = "review";
          await this.commit();
        } catch (error) {
          this.state = before;
          throw error;
        }
      });
    } catch (error) {
      await Promise.all(captured.filter((file) => !this.state.artifacts.some((value) => value.id === file.id)).map((file) => unlink(join3(this.config.storageRoot, "artifacts", file.id))));
      await this.enqueue(async () => {
        const task = this.task(id2);
        task.status = controller.signal.aborted && !timedOut ? "cancelled" : "failed";
        task.error = timedOut ? "Task timeout reached" : controller.signal.aborted ? "Stopped by user or host shutdown" : error instanceof Error ? error.message : "Employee task failed";
        task.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
        await this.commit();
      });
    } finally {
      clearTimeout(timeout);
      this.live.delete(id2);
    }
  }
  async capture(employee, project, task, result) {
    const root = await realpath2(employee.cwd || project.cwd);
    const privateRoot = await realpath2(this.config.storageRoot);
    const artifactRoot = join3(this.config.storageRoot, "artifacts");
    await mkdir3(artifactRoot, { recursive: true, mode: 448 });
    const artifacts = [];
    let remainingBytes = this.config.maxArtifactBytes;
    const publish = async (name2, bytes) => {
      if (bytes.length > remainingBytes) throw new Error(`Task result files exceed the configured limit: ${name2}`);
      const id2 = randomUUID3();
      await writeFile3(join3(artifactRoot, id2), bytes, { flag: "wx", mode: 384 });
      artifacts.push({ id: id2, taskId: task.id, projectId: project.id, name: name2, size: bytes.length, sha256: createHash2("sha256").update(bytes).digest("hex") });
      remainingBytes -= bytes.length;
    };
    try {
      await publish("handoff.md", Buffer.from(result.message));
      const names = [...new Set([...task.outputFiles, ...result.files].map(outputName))];
      for (const name2 of names) {
        const path = await realpath2(join3(root, name2));
        if (!within(root, path)) throw new Error(`Result file resolves outside the employee workspace: ${name2}`);
        if (within(privateRoot, path)) throw new Error("Studio private storage cannot be shared as an employee result");
        outputName(relative2(root, path));
        const info = await stat(path);
        if (!info.isFile() || info.size > this.config.maxArtifactBytes) throw new Error(`Result must be a file within the configured size limit: ${name2}`);
        const chunks = [];
        let bytes = 0;
        for await (const chunk of createReadStream(path)) {
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          bytes += buffer.length;
          if (bytes > remainingBytes) throw new Error(`Task result files exceed the configured limit: ${name2}`);
          chunks.push(buffer);
        }
        await publish(name2, Buffer.concat(chunks));
      }
      return artifacts;
    } catch (error) {
      await Promise.all(artifacts.map((file) => unlink(join3(artifactRoot, file.id))));
      throw error;
    }
  }
  /** Read an immutable published result file by its registered identity.
   * @param id - Artifact id supplied by the UI.
   * @returns File metadata and bytes.
   */
  async artifact(id2) {
    const artifact = this.state.artifacts.find((file) => file.id === id2);
    if (!artifact) throw new Error("Result file does not exist");
    const bytes = await readFile2(join3(this.config.storageRoot, "artifacts", artifact.id));
    if (createHash2("sha256").update(bytes).digest("hex") !== artifact.sha256) throw new Error("Stored result file hash does not match");
    return { artifact: structuredClone(artifact), bytes };
  }
  /** Stop scheduling, cancel employees, and await complete executor teardown.
   * @returns Settlement after every owned run stops.
   */
  async close() {
    this.closing = true;
    const runs = [...this.active.values(), ...this.meetingRuns.values()];
    for (const run of runs) run.controller.abort(new Error("Host shutdown"));
    await Promise.allSettled(runs.map((run) => run.done));
    await this.serial;
  }
};
function parseMinutes(text2, meeting2) {
  const fallback = {
    summary: text2.slice(0, 1e5),
    decisions: [],
    projectName: meeting2.title.slice(0, 500),
    objective: meeting2.agenda,
    acceptanceCriteria: "",
    tasks: []
  };
  let raw;
  try {
    raw = JSON.parse(text2.replace(/^```(?:json)?\s*|\s*```$/g, ""));
  } catch {
    return { minutes: fallback, parsed: false };
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return { minutes: fallback, parsed: false };
  const value = raw;
  const string = (key, max) => {
    const field = value[key];
    return typeof field === "string" ? field.slice(0, max) : "";
  };
  const tasks = Array.isArray(value.tasks) ? value.tasks.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const task = item;
    if (typeof task.employeeId !== "string" || !meeting2.attendeeIds.includes(task.employeeId) || typeof task.title !== "string" || typeof task.instruction !== "string" || !task.title.trim()) return [];
    return [{ employeeId: task.employeeId, title: task.title.slice(0, 500), instruction: task.instruction.slice(0, 1e5) }];
  }) : [];
  const summary = string("summary", 1e5);
  if (!summary && !tasks.length) return { minutes: fallback, parsed: false };
  return { parsed: true, minutes: {
    summary,
    tasks,
    decisions: Array.isArray(value.decisions) ? value.decisions.filter((item) => typeof item === "string").map((item) => item.slice(0, 1e5)) : [],
    projectName: string("projectName", 500) || fallback.projectName,
    objective: string("objective", 1e5) || fallback.objective,
    acceptanceCriteria: string("acceptanceCriteria", 1e5)
  } };
}

// src/executor.ts
import { mkdtemp, readFile as readFile3, writeFile as writeFile4, rm as rm2, mkdir as mkdir4, stat as stat3 } from "node:fs/promises";
import { join as join5, resolve as resolve4 } from "node:path";
import { randomUUID as randomUUID6 } from "node:crypto";
import { StringDecoder as StringDecoder2 } from "node:string_decoder";
import { credentialRef } from "@deepseek-ai/dsh-credentials";

// ../../../deepseek-harness/packages/sdk/client/lib/index.js
import { randomUUID as randomUUID5 } from "node:crypto";
import { dirname as dirname3, resolve as resolve3 } from "node:path";
import { spawn } from "node:child_process";

// ../../../deepseek-harness/packages/sdk/protocol/src/transport.ts
import { randomUUID as randomUUID4 } from "node:crypto";
import { StringDecoder } from "node:string_decoder";
var JsonRpcResponseError = class extends Error {
  /**
   * @param code - the wire error code, or `undefined` when the peer sent none.
   * @param message - the wire error message.
   * @param data - the optional structured error payload, verbatim.
   */
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
    this.name = "JsonRpcResponseError";
  }
  code;
  data;
};
var JsonRpcLineTransport = class {
  constructor(input, output) {
    this.input = input;
    this.output = output;
  }
  input;
  output;
  buffer = "";
  decoder = new StringDecoder("utf8");
  started = false;
  requestHandler;
  notificationHandler;
  pending = /* @__PURE__ */ new Map();
  /** Attach the input listeners and begin reading frames. Idempotent. */
  start() {
    if (this.started) return;
    this.started = true;
    this.input.on("data", this.onData);
    this.input.on("error", this.onInputError);
    this.input.on("end", this.onInputEnd);
  }
  /**
   * Detach listeners and reject pending requests. Safe before {@link start}.
   */
  close() {
    this.input.off("data", this.onData);
    this.input.off("error", this.onInputError);
    this.input.off("end", this.onInputEnd);
    this.failPending(new Error("JSON-RPC transport closed"));
  }
  /**
   * Install the request handler, replacing any prior handler.
   * @param handler - resolves to the response `result`; a rejection becomes a
   * `-32603` error response carrying the message.
   */
  onRequest(handler) {
    this.requestHandler = handler;
  }
  /**
   * Install the notification handler, replacing any prior handler.
   * @param handler - invoked per notification with the method and normalized
   * params object.
   */
  onNotification(handler) {
    this.notificationHandler = handler;
  }
  /**
   * Send a request and await its response.
   * @param method - the JSON-RPC method name.
   * @param params - the request parameters object.
   * @param signal - optional abandonment signal: aborting removes the pending
   * entry (no state is retained for a response that may never come) and
   * rejects with the signal's reason.
   * @returns the result; rejects per {@link JsonRpcTransportPeer.request}.
   */
  request(method, params, signal) {
    const id2 = `req_${randomUUID4().replaceAll("-", "")}`;
    const message = { jsonrpc: "2.0", id: id2, method, params };
    return new Promise((resolve6, reject) => {
      let detach = () => {
      };
      if (signal !== void 0) {
        if (signal.aborted) {
          reject(abortError(signal.reason));
          return;
        }
        const onAbort = () => {
          this.pending.delete(id2);
          reject(abortError(signal.reason));
        };
        signal.addEventListener("abort", onAbort, { once: true });
        detach = () => {
          signal.removeEventListener("abort", onAbort);
        };
      }
      this.pending.set(id2, {
        resolve: (value) => {
          detach();
          resolve6(value);
        },
        reject: (error) => {
          detach();
          reject(error);
        }
      });
      try {
        this.write(message);
      } catch (error) {
        this.pending.delete(id2);
        detach();
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
  notify(method, params) {
    this.write(params === void 0 ? { jsonrpc: "2.0", method } : { jsonrpc: "2.0", method, params });
  }
  /**
   * Wait for prior frame write callbacks. The empty barrier emits no bytes.
   * @returns a promise that settles with the output write callback.
   */
  flush() {
    return new Promise((resolve6, reject) => {
      this.output.write("", (error) => {
        if (error) reject(error);
        else resolve6();
      });
    });
  }
  onData = (chunk) => {
    this.buffer += typeof chunk === "string" ? chunk : this.decoder.write(chunk);
    this.drainLines();
  };
  drainLines() {
    for (; ; ) {
      const newline = this.buffer.indexOf("\n");
      if (newline < 0) break;
      const line = this.buffer.slice(0, newline).trim();
      this.buffer = this.buffer.slice(newline + 1);
      if (!line) continue;
      void this.handleLine(line);
    }
  }
  onInputError = (error) => {
    this.failPending(error);
  };
  onInputEnd = () => {
    this.buffer += this.decoder.end();
    this.drainLines();
    this.failPending(new Error("JSON-RPC input closed"));
  };
  async handleLine(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      return;
    }
    if (!message || typeof message !== "object") return;
    const frame = message;
    const id2 = frame.id;
    const method = frame.method;
    if ((typeof id2 === "string" || typeof id2 === "number") && typeof method === "string") {
      await this.handleIncomingRequest(id2, method, objectParams(frame.params));
      return;
    }
    if (typeof id2 === "string" || typeof id2 === "number") {
      this.handleIncomingResponse(id2, frame);
      return;
    }
    if (typeof method === "string") {
      this.notificationHandler?.(method, objectParams(frame.params));
    }
  }
  async handleIncomingRequest(id2, method, params) {
    const handler = this.requestHandler;
    if (!handler) {
      this.writeError(id2, -32601, `method not found: ${method}`);
      return;
    }
    try {
      const result = await handler(method, params);
      this.write({ jsonrpc: "2.0", id: id2, result });
    } catch (error) {
      this.writeError(id2, -32603, error instanceof Error ? error.message : String(error));
    }
  }
  handleIncomingResponse(id2, frame) {
    const pending = this.pending.get(id2);
    if (!pending) return;
    this.pending.delete(id2);
    if (frame.error && typeof frame.error === "object") {
      const error = frame.error;
      pending.reject(new JsonRpcResponseError(
        typeof error.code === "number" ? error.code : void 0,
        typeof error.message === "string" ? error.message : "JSON-RPC error",
        error.data
      ));
      return;
    }
    pending.resolve(frame.result);
  }
  writeError(id2, code, message) {
    this.write({ jsonrpc: "2.0", id: id2, error: { code, message } });
  }
  write(message) {
    this.output.write(`${JSON.stringify(message)}
`);
  }
  failPending(error) {
    const pending = [...this.pending.values()];
    this.pending.clear();
    for (const waiter of pending) waiter.reject(error);
  }
};
function objectParams(params) {
  return params && typeof params === "object" && !Array.isArray(params) ? params : {};
}
function abortError(reason) {
  return reason instanceof Error ? reason : new Error(`JSON-RPC request aborted: ${String(reason)}`);
}

// ../../../deepseek-harness/packages/sdk/client/lib/index.js
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
function exitsWithin(child, ms) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true);
  return new Promise((resolve6) => {
    const onExit = () => {
      clearTimeout(timer);
      resolve6(true);
    };
    const timer = setTimeout(() => {
      child.removeListener("exit", onExit);
      resolve6(false);
    }, ms).unref();
    child.once("exit", onExit);
  });
}
function forceTerminateWithin(child, ms) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve6, reject) => {
    let accepted = false;
    let settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      child.off("exit", onExit);
      child.off("error", onError);
    };
    const settle = (complete) => {
      if (settled) return;
      settled = true;
      cleanup();
      complete();
    };
    const onExit = () => {
      settle(resolve6);
    };
    const onError = (error) => {
      settle(() => {
        reject(error);
      });
    };
    child.once("exit", onExit);
    child.once("error", onError);
    const timer = setTimeout(() => {
      const disposition = accepted ? "accepted" : "refused";
      settle(() => {
        reject(/* @__PURE__ */ new Error(`runtime process did not exit within ${ms}ms after SIGKILL was ${disposition}`));
      });
    }, ms).unref();
    try {
      accepted = child.kill("SIGKILL");
      if (child.exitCode !== null || child.signalCode !== null) settle(resolve6);
    } catch (error) {
      settle(() => {
        reject(new Error("SIGKILL failed", { cause: error }));
      });
    }
  });
}
async function disposeRuntimeProcess(child, graces, platform = process.platform) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.stdin?.end();
  if (await exitsWithin(child, graces.disposeEofGraceMs)) return;
  if (platform !== "win32") {
    child.kill("SIGTERM");
    if (await exitsWithin(child, graces.disposeGraceMs)) return;
  }
  await forceTerminateWithin(child, graces.disposeGraceMs);
}
function manifest(url) {
  return JSON.parse(readFileSync(fileURLToPath(url), "utf8"));
}
function resolveDshBinFromManifests(dshManifestUrl, clientManifestUrl) {
  const dshManifest = manifest(dshManifestUrl);
  const clientManifest = manifest(clientManifestUrl);
  if (typeof dshManifest.version !== "string" || dshManifest.version !== clientManifest.version) throw new Error(`dsh SDK client ${String(clientManifest.version)} requires the same dsh version, got ${String(dshManifest.version)}`);
  const bin = typeof dshManifest.bin === "object" && dshManifest.bin !== null ? dshManifest.bin.dsh : dshManifest.bin;
  if (typeof bin !== "string" || bin === "") throw new Error("@deepseek-ai/dsh declares no dsh executable");
  return resolve3(dirname3(fileURLToPath(dshManifestUrl)), bin);
}
function resolveDshNodeLaunchFromManifests(dshManifestUrl, clientManifestUrl, sourceLoaderUrl) {
  const bin = resolveDshBinFromManifests(dshManifestUrl, clientManifestUrl);
  if (existsSync(bin)) return {
    nodeArgs: [bin],
    patches: [],
    environment: {}
  };
  const packageDir = dirname3(fileURLToPath(dshManifestUrl));
  const sourceBin = resolve3(packageDir, "src/bin.ts");
  const sourcePatch = resolve3(packageDir, "src/sdk-source.cordis.patch.yml");
  const sourceTsconfig = resolve3(packageDir, "tsconfig.json");
  if (!existsSync(sourceBin) || !existsSync(sourcePatch) || !existsSync(sourceTsconfig)) throw new Error(`@deepseek-ai/dsh is missing its built executable ${bin} and complete source launch files ${sourceBin}, ${sourcePatch}, ${sourceTsconfig}`);
  return {
    nodeArgs: [
      "--import",
      sourceLoaderUrl ?? import.meta.resolve("tsx/esm"),
      sourceBin
    ],
    patches: [sourcePatch],
    environment: { TSX_TSCONFIG_PATH: sourceTsconfig }
  };
}
function installedDshNodeLaunch() {
  return resolveDshNodeLaunchFromManifests(import.meta.resolve("@deepseek-ai/dsh/package.json"), new URL("../package.json", import.meta.url).href);
}
function resolveDshLaunch(options = {}, callerCwd = process.cwd()) {
  const profile = options.profile ?? "sdk";
  const dshLaunch = options.dshBin === void 0 ? installedDshNodeLaunch() : {
    nodeArgs: [resolve3(callerCwd, options.dshBin)],
    patches: [],
    environment: {}
  };
  const patches = [...dshLaunch.patches, ...(options.patches ?? []).map((path) => resolve3(callerCwd, path))];
  const dshHome = options.dshHome === void 0 ? void 0 : resolve3(callerCwd, options.dshHome);
  return {
    command: process.execPath,
    args: [
      ...dshLaunch.nodeArgs,
      "--profile",
      profile,
      ...patches.flatMap((path) => ["--patch", path])
    ],
    ...options.processCwd === void 0 ? {} : { cwd: resolve3(callerCwd, options.processCwd) },
    environment: () => ({
      ...options.env ?? process.env,
      ...dshLaunch.environment,
      ...dshHome === void 0 ? {} : { DSH_HOME: dshHome }
    }),
    description: `dsh profile ${JSON.stringify(profile)}`,
    initializeTimeoutMs: options.initializeTimeoutMs ?? 1e4,
    ...options.requestTimeoutMs === void 0 ? {} : { requestTimeoutMs: options.requestTimeoutMs },
    ...options.shutdownTimeoutMs === void 0 ? {} : { shutdownTimeoutMs: options.shutdownTimeoutMs },
    ...options.disposeEofGraceMs === void 0 ? {} : { disposeEofGraceMs: options.disposeEofGraceMs },
    ...options.disposeGraceMs === void 0 ? {} : { disposeGraceMs: options.disposeGraceMs }
  };
}
var STDERR_TAIL_LIMIT = 400;
var STREAM_SETTLE_MS = 100;
var TransportClosedError = class extends Error {
  /** @param message - the failure description, including any stderr tail. */
  constructor(message) {
    super(message);
    this.name = "TransportClosedError";
  }
};
var RequestTimeoutError = class extends Error {
  /** @param message - which method timed out. */
  constructor(message) {
    super(message);
    this.name = "RequestTimeoutError";
  }
};
var SdkProtocolError = class extends Error {
  /** @param message - the protocol violation description. */
  constructor(message) {
    super(message);
    this.name = "SdkProtocolError";
  }
};
var NotificationSubscriptionImpl = class {
  state;
  unsubscribe;
  constructor(state, unsubscribe) {
    this.state = state;
    this.unsubscribe = unsubscribe;
  }
  /**
  * Await the next matching notification.
  * @returns the notification; after the runtime died, drains what was
  * already delivered and then rejects; after {@link close}, rejects
  * immediately (the queue is dropped).
  */
  next() {
    const queued = this.state.queue.shift();
    if (queued !== void 0) return Promise.resolve(queued);
    if (this.state.failure !== void 0) return Promise.reject(this.state.failure);
    return new Promise((resolve6, reject) => {
      this.state.waiters.push({
        resolve: resolve6,
        reject
      });
    });
  }
  /**
  * Drain one already-delivered notification without waiting.
  * @returns the next queued notification, or `undefined` when none is queued.
  */
  tryNext() {
    return this.state.queue.shift();
  }
  /** Detach from the client; queued items drop and pending waiters reject. */
  close() {
    this.unsubscribe();
    this.state.queue.length = 0;
    this.fail(new TransportClosedError("notification subscription closed"));
  }
  /**
  * Reject pending and future waits (delivery stops; the first failure wins).
  * Already-queued notifications remain drainable via {@link next}/{@link tryNext}.
  * @param error - the terminal failure delivered to waiters.
  */
  fail(error) {
    this.state.failure ??= error;
    for (const waiter of this.state.waiters.splice(0)) waiter.reject(this.state.failure);
  }
  /**
  * Deliver one notification to a waiter or the queue when the filter
  * matches. A throwing filter fails only THIS subscription (detached, the
  * throw becomes its terminal error) — it never disturbs sibling
  * subscriptions or the transport's read loop.
  * @param notification - the wire notification to deliver.
  */
  push(notification) {
    let matches;
    try {
      matches = this.state.filter === void 0 || this.state.filter(notification);
    } catch (error) {
      this.unsubscribe();
      this.fail(error instanceof Error ? error : new Error(String(error)));
      return;
    }
    if (!matches) return;
    const waiter = this.state.waiters.shift();
    if (waiter !== void 0) waiter.resolve(notification);
    else this.state.queue.push(notification);
  }
  /**
  * Iterate notifications until the subscription or runtime closes (the
  * terminating rejection propagates).
  * @returns an async iterator over {@link next} results.
  */
  async *[Symbol.asyncIterator]() {
    for (; ; ) yield await this.next();
  }
};
var HarnessClient = class {
  /** Original public dsh launch and timeout options for this client. */
  options;
  runtime;
  child;
  transport;
  stderrTail = [];
  subscriptions = /* @__PURE__ */ new Map();
  sessionParents = /* @__PURE__ */ new Map();
  subscriptionSerial = 0;
  exitCode;
  spawnError;
  streamsSettled = Promise.resolve();
  closeTask;
  constructor(options = {}, runtime) {
    this.options = options;
    this.runtime = runtime ?? resolveDshLaunch(options);
  }
  /**
  * Spawn the runtime subprocess and start reading frames. Idempotent while
  * the process is live; rejects reuse after {@link close}.
  */
  start() {
    if (this.closeTask !== void 0) throw new TransportClosedError("DeepSeek Harness runtime client is closed");
    if (this.child !== void 0) return;
    const child = spawn(this.runtime.command, this.runtime.args, {
      cwd: this.runtime.cwd,
      env: this.runtime.environment(),
      stdio: [
        "pipe",
        "pipe",
        "pipe"
      ]
    });
    this.child = child;
    child.once("error", (error) => {
      this.spawnError = error;
      this.transport?.close();
      this.failSubscriptions(this.closedError("DeepSeek Harness runtime failed to start"));
    });
    child.stdin.on("error", () => {
    });
    let stderrBuffer = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderrBuffer += chunk;
      const newline = stderrBuffer.lastIndexOf("\n");
      if (newline >= 0) {
        this.appendStderr(stderrBuffer.slice(0, newline).split("\n"));
        stderrBuffer = stderrBuffer.slice(newline + 1);
      }
    });
    let signalStreamsSettled;
    this.streamsSettled = new Promise((resolve6) => {
      signalStreamsSettled = resolve6;
    });
    const settled = {
      stderr: false,
      exited: false
    };
    const maybeSettle = () => {
      if (settled.stderr && settled.exited) signalStreamsSettled();
    };
    child.stderr.once("close", () => {
      if (stderrBuffer.length > 0) this.appendStderr([stderrBuffer]);
      settled.stderr = true;
      maybeSettle();
    });
    child.once("exit", (code) => {
      this.exitCode = code;
      settled.exited = true;
      maybeSettle();
      this.failSubscriptions(this.closedError("DeepSeek Harness runtime exited"));
    });
    child.once("close", () => {
      this.transport?.close();
    });
    const transport = new JsonRpcLineTransport(child.stdout, child.stdin);
    transport.onNotification((method, params) => {
      this.dispatchNotification({
        method,
        params
      });
    });
    transport.start();
    this.transport = transport;
  }
  /**
  * Perform the process-wide handshake.
  * @param params - workspace cwd plus the provider/model route.
  * @returns the runtime's wire identity.
  */
  async initialize(params) {
    const result = await this.request("initialize", { ...params }, this.runtime.initializeTimeoutMs);
    if (!isRecord(result) || !isRecord(result.serverInfo) || typeof result.serverInfo.name !== "string" || typeof result.serverInfo.version !== "string") throw new SdkProtocolError(`initialize returned no server identity: ${JSON.stringify(result)}`);
    return { serverInfo: {
      name: result.serverInfo.name,
      version: result.serverInfo.version
    } };
  }
  /**
  * Queue one prompt and return its durable inbox identity.
  * @param sessionId - target session; an unknown id creates it.
  * @param contentBlocks - the user message, sent verbatim.
  * @returns the queued message id.
  */
  async prompt(sessionId, contentBlocks) {
    const params = {
      sessionId,
      contentBlocks
    };
    const result = await this.request("session/prompt", { ...params });
    if (!isRecord(result) || typeof result.messageId !== "string") throw new SdkProtocolError(`session/prompt returned no message id: ${JSON.stringify(result)}`);
    return result.messageId;
  }
  /**
  * Send one JSON-RPC request and await its result.
  * @param method - the wire method name.
  * @param params - the params object; omitted params send `{}`.
  * @param timeoutMs - per-call override of {@link HarnessClientOptions.requestTimeoutMs}.
  * @returns the raw result; rejects with {@link JsonRpcResponseError} on a
  * protocol error response, {@link RequestTimeoutError} on timeout, and
  * {@link TransportClosedError} when the runtime is gone.
  */
  async request(method, params, timeoutMs) {
    this.start();
    if (this.exitCode !== void 0 || this.spawnError !== void 0) {
      await this.settleStreams();
      throw this.closedError("DeepSeek Harness runtime is not running");
    }
    const transport = this.transport;
    if (transport === void 0) throw new TransportClosedError("DeepSeek Harness runtime is not running");
    const timeout = timeoutMs ?? this.runtime.requestTimeoutMs;
    try {
      if (timeout === void 0) return await transport.request(method, params ?? {});
      const abandon = new AbortController();
      const timer = setTimeout(() => {
        const stderr = this.stderrTail.length === 0 ? "" : `; stderr tail:
${this.stderrTail.join("\n")}`;
        abandon.abort(new RequestTimeoutError(`${method} timed out after ${timeout}ms waiting for ${this.runtime.description}${stderr}`));
      }, timeout);
      try {
        return await transport.request(method, params ?? {}, abandon.signal);
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      if (error instanceof JsonRpcResponseError || error instanceof RequestTimeoutError) throw error;
      await this.settleStreams();
      throw this.closedError(errorMessage(error));
    }
  }
  /**
  * Subscribe to server notifications.
  * @param filter - optional predicate; omitted means every notification.
  * @returns the subscription handle; close it to stop delivery. After
  * {@link close} or runtime death the handle is born failed — there is no
  * producer left, so `next()` rejects instead of waiting forever.
  */
  subscribe(filter) {
    const id2 = String(this.subscriptionSerial++);
    const subscription = new NotificationSubscriptionImpl({
      queue: [],
      waiters: [],
      filter,
      failure: void 0
    }, () => {
      this.subscriptions.delete(id2);
    });
    if (this.closeTask !== void 0 || this.exitCode !== void 0 || this.spawnError !== void 0) {
      subscription.fail(this.closedError("DeepSeek Harness runtime closed"));
      return subscription;
    }
    this.subscriptions.set(id2, subscription);
    return subscription;
  }
  /**
  * Subscribe to one session and the descendants discovered from
  * `subagent.started` lineage edges. The runtime notifies for every session
  * in its context, so this client applies the scope.
  * @param sessionId - the root session id.
  * @returns the filtered subscription handle.
  */
  subscribeSessionTree(sessionId) {
    return this.subscribe((notification) => {
      const params = notification.params;
      if (notification.method === "subagent.started" || notification.method === "subagent.finished") {
        const parentId = params.parentSessionId;
        if (typeof parentId === "string" && this.isDescendantOf(parentId, sessionId)) return true;
        return params.childSessionId === sessionId;
      }
      const relatedId = params.sessionId;
      return typeof relatedId === "string" && this.isDescendantOf(relatedId, sessionId);
    });
  }
  /**
  * Shut the runtime down and reap it: a best-effort protocol `shutdown`
  * bounded by `shutdownTimeoutMs`, then the shared stdin-EOF → SIGTERM →
  * SIGKILL ladder until the process actually exited. Idempotent.
  * @returns settlement of the complete teardown.
  */
  close() {
    this.closeTask ??= this.performClose();
    return this.closeTask;
  }
  async performClose() {
    const child = this.child;
    if (child === void 0) return;
    try {
      await this.request("shutdown", void 0, this.runtime.shutdownTimeoutMs ?? 1e3);
    } catch (error) {
      this.appendStderr([`shutdown request failed: ${errorMessage(error)}`]);
    }
    await disposeRuntimeProcess(child, {
      disposeEofGraceMs: this.runtime.disposeEofGraceMs ?? 6e3,
      disposeGraceMs: this.runtime.disposeGraceMs ?? 3e3
    });
    this.transport?.close();
    this.failSubscriptions(this.closedError("DeepSeek Harness runtime closed"));
  }
  dispatchNotification(notification) {
    this.recordSessionRelationship(notification);
    for (const subscription of this.subscriptions.values()) subscription.push(notification);
  }
  recordSessionRelationship(notification) {
    if (notification.method !== "subagent.started") return;
    const parentId = notification.params.parentSessionId;
    const childId = notification.params.childSessionId;
    if (typeof parentId === "string" && parentId !== "" && typeof childId === "string" && childId !== "" && parentId !== childId) this.sessionParents.set(childId, parentId);
  }
  isDescendantOf(sessionId, rootSessionId) {
    const visited = /* @__PURE__ */ new Set();
    let current = sessionId;
    while (!visited.has(current)) {
      if (current === rootSessionId) return true;
      visited.add(current);
      const parent = this.sessionParents.get(current);
      if (parent === void 0) return false;
      current = parent;
    }
    return false;
  }
  failSubscriptions(error) {
    for (const subscription of this.subscriptions.values()) subscription.fail(error);
  }
  appendStderr(lines) {
    const kept = lines.filter((line) => line.length > 0);
    this.stderrTail.push(...kept);
    if (this.stderrTail.length > STDERR_TAIL_LIMIT) this.stderrTail.splice(0, this.stderrTail.length - STDERR_TAIL_LIMIT);
  }
  settleStreams() {
    return Promise.race([this.streamsSettled, new Promise((resolve6) => {
      setTimeout(resolve6, STREAM_SETTLE_MS);
    })]);
  }
  closedError(reason) {
    const parts = [`${this.runtime.description}: ${reason}`];
    if (this.spawnError !== void 0) parts.push(`spawn error: ${this.spawnError.message}`);
    if (this.exitCode !== void 0) parts.push(`exit code: ${String(this.exitCode)}`);
    if (this.stderrTail.length > 0) parts.push(`stderr tail:
${this.stderrTail.join("\n")}`);
    return new TransportClosedError(parts.join("\n"));
  }
};
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
var DeepSeekHarness = class {
  clientInstance;
  createClient;
  cwd;
  provider;
  model;
  reasoningEffort;
  maxTokens;
  initialized;
  closed = false;
  constructor(options = {}, clientFactory) {
    this.createClient = clientFactory ?? (() => new HarnessClient(options));
    this.clientInstance = this.createClient();
    this.cwd = resolve3(options.cwd ?? options.processCwd ?? process.cwd());
    this.provider = options.provider ?? "deepseek-official";
    this.model = options.model ?? "deepseek-v4-flash";
    this.reasoningEffort = options.reasoningEffort;
    this.maxTokens = options.maxTokens;
  }
  /**
  * The underlying JSON-RPC client (exposed for low-level access). A failed
  * handshake swaps in a fresh instance only after cleanup proves the runtime
  * exited; cleanup failure retains this client, so do not cache it across a
  * failed {@link start}.
  * @returns the client currently owning the runtime subprocess.
  */
  get client() {
    return this.clientInstance;
  }
  /**
  * Start the subprocess and perform the `initialize` handshake once. On
  * failure, successful SDK-owned cleanup reaps the runtime and installs a
  * fresh client (`HarnessClient.close` is permanent), so a later call retries
  * with a new subprocess unless {@link close} already ended this harness. If
  * cleanup also fails, rejects with an `AggregateError` whose ordered errors
  * preserve both causes and retains the failed client rather than spawning
  * alongside a process whose exit was not proved.
  * @returns settlement of the (memoized) handshake.
  */
  start() {
    this.initialized ??= (async () => {
      try {
        this.clientInstance.start();
        await this.clientInstance.initialize({
          cwd: this.cwd,
          provider: this.provider,
          model: this.model,
          ...this.reasoningEffort === void 0 ? {} : { reasoningEffort: this.reasoningEffort },
          ...this.maxTokens === void 0 ? {} : { maxTokens: this.maxTokens }
        });
      } catch (error) {
        this.initialized = void 0;
        try {
          await this.clientInstance.close();
        } catch (cleanupError) {
          throw new AggregateError([error, cleanupError], "DeepSeek Harness initialization and cleanup failed");
        }
        if (!this.closed) this.clientInstance = this.createClient();
        throw error;
      }
    })();
    return this.initialized;
  }
  /**
  * Open a session handle (no wire traffic; the runtime creates the session
  * on its first prompt).
  * @param sessionId - explicit id to reuse; omitted mints a fresh one.
  * @returns the session handle.
  */
  session(sessionId) {
    return new HarnessSession(this, sessionId ?? `session-${randomUUID5().replaceAll("-", "")}`);
  }
  /**
  * Run one prompt on a fresh (or named) session.
  * @param input - prompt text, or content blocks sent verbatim.
  * @param options - optional session id and per-notification observer.
  * @returns the owned activity interval.
  */
  run(input, options) {
    return this.session(options?.sessionId).run(input, options);
  }
  /**
  * Shut down and reap the runtime subprocess. Idempotent and terminal —
  * a closed harness no longer retries a failed handshake.
  * @returns settlement of the complete teardown.
  */
  close() {
    this.closed = true;
    return this.clientInstance.close();
  }
  /**
  * `await using` support: {@link close}.
  * @returns settlement of the teardown.
  */
  [Symbol.asyncDispose]() {
    return this.close();
  }
};
var HarnessSession = class {
  harness;
  id;
  /**
  * @param harness - the owning harness (supplies the client and handshake).
  * @param id - the wire session id this handle runs on.
  */
  constructor(harness, id2) {
    this.harness = harness;
    this.id = id2;
  }
  /**
  * Queue one prompt, then observe the whole session through its next idle.
  * @param input - prompt text, or content blocks sent verbatim.
  * @param options - optional per-notification observer.
  * @returns the owned activity interval; rejects on transport loss, timeout,
  * or a protocol error.
  */
  async run(input, options) {
    await this.harness.start();
    const client = this.harness.client;
    const contentBlocks = normalizeInput(input);
    const events = [];
    const notifications = [];
    const subscription = client.subscribeSessionTree(this.id);
    const collect = (notification) => {
      if (notification.method === "session.event" && notification.params.sessionId === this.id) {
        const event = validatedSessionEvent(notification.params.event);
        notifications.push(notification);
        options?.onNotification?.(notification);
        events.push(event);
        return;
      }
      notifications.push(notification);
      options?.onNotification?.(notification);
    };
    try {
      const messageId = await client.prompt(this.id, contentBlocks);
      let received = false;
      while (true) {
        const notification = await subscription.next();
        if (!received) {
          if (notification.method !== "session.event" || notification.params.sessionId !== this.id || !isInboxReceipt(notification.params.event, messageId)) continue;
          received = true;
        }
        collect(notification);
        if (notification.method === "session.status" && notification.params.sessionId === this.id && notification.params.status === "idle") break;
      }
    } finally {
      subscription.close();
    }
    return {
      sessionId: this.id,
      finalResponse: finalResponse(events),
      events,
      notifications
    };
  }
};
function normalizeInput(input) {
  return typeof input === "string" ? [{
    type: "text",
    text: input
  }] : input;
}
function validatedTurnEndReason(value) {
  if (!isRecord(value) || typeof value.kind !== "string") throw new SdkProtocolError(`turn/end carried no reason envelope: ${JSON.stringify(value)}`);
  if (value.kind === "aborted") {
    if (!isRecord(value.reason) || typeof value.reason.kind !== "string") throw new SdkProtocolError(`turn/end carried a malformed aborted reason: ${JSON.stringify(value)}`);
    switch (value.reason.kind) {
      case "user":
      case "parent":
      case "disposed":
      case "legacy":
        break;
      case "hook":
        if (typeof value.reason.reason !== "string") throw new SdkProtocolError(`turn/end carried a malformed hook abort reason: ${JSON.stringify(value)}`);
        break;
      default:
        throw new SdkProtocolError(`turn/end carried an unknown abort reason: ${JSON.stringify(value)}`);
    }
  }
  return value;
}
function validatedSessionEvent(value) {
  if (!isRecord(value) || typeof value.type !== "string") throw new SdkProtocolError(`session.event carried no event envelope: ${JSON.stringify(value)}`);
  if (value.type === "assistant/message") {
    const message = isRecord(value.data) ? value.data.message : void 0;
    const content = isRecord(message) ? message.content : void 0;
    if (!Array.isArray(content) || !content.every((block) => isRecord(block) && typeof block.type === "string")) throw new SdkProtocolError(`assistant/message event carried malformed content: ${JSON.stringify(value)}`);
  }
  if (value.type === "turn/end") {
    const data = isRecord(value.data) ? value.data : void 0;
    if (data === void 0) throw new SdkProtocolError(`turn/end event carried malformed data: ${JSON.stringify(value)}`);
    validatedTurnEndReason(data.reason);
  }
  return value;
}
function isInboxReceipt(value, messageId) {
  if (!isRecord(value) || value.type !== "agent/inbox/spliced" || !isRecord(value.data)) return false;
  const inserted = value.data.inserted;
  return Array.isArray(inserted) && inserted.some((message) => isRecord(message) && message.id === messageId);
}
function finalResponse(events) {
  for (let index = events.length - 1; index >= 0; index--) {
    const event = events[index];
    if (event?.type !== "assistant/message") continue;
    return event.data.message.content.filter((block) => block.type === "text").map((block) => block.text).join("");
  }
  return "";
}

// src/executor.ts
import { scrubbedParentEnv } from "@deepseek-ai/dsh-subprocess";

// src/native-command.ts
import { stat as stat2 } from "node:fs/promises";
import { delimiter, join as join4 } from "node:path";
async function isFile(path) {
  try {
    return (await stat2(path)).isFile();
  } catch {
    return false;
  }
}
async function onPath(name2, env = process.env) {
  const extensions = process.platform === "win32" ? ["", ...(env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";").filter(Boolean)] : [""];
  for (const directory of (env.PATH ?? env.Path ?? "").split(delimiter).filter(Boolean)) {
    for (const extension of extensions) if (await isFile(join4(directory, name2 + extension))) return true;
  }
  return false;
}
function commandResolver(configured, locate, env = process.env) {
  let located = null;
  return async () => {
    const [name2] = configured;
    if (configured.length !== 1 || name2 === void 0 || /[\\/]/.test(name2) || await onPath(name2, env)) return configured;
    if (located && await isFile(located)) return [located];
    located = await locate();
    return located && await isFile(located) ? [located] : configured;
  };
}
function explainSpawnError(error, engine2, command) {
  const code = typeof error === "object" && error !== null && "code" in error ? error.code : void 0;
  if (code !== "ENOENT" && !(error instanceof Error && /\bENOENT\b/.test(error.message))) return error;
  const product = engine2 === "codex" ? "Codex CLI (npm i -g @openai/codex, or the Codex desktop app)" : "Claude Code CLI";
  return new Error(`${engine2} executable not found: "${command}". Install the ${product}, or set ${engine2}Command in the dsh-w-studio plugin config to its full path.`, { cause: error });
}

// src/executor.ts
var resultSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    message: { type: "string" },
    files: { type: "array", items: { type: "string" } },
    handoffs: { type: "array", items: {
      type: "object",
      additionalProperties: false,
      properties: { employeeId: { type: "string" }, message: { type: "string" } },
      required: ["employeeId", "message"]
    } },
    needsUser: { type: "string" }
  },
  required: ["message", "files", "handoffs", "needsUser"]
};
function record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
async function jsonLines(stream, maxBytes, onEvent) {
  const decoder = new StringDecoder2("utf8");
  let line = "";
  let dropping = false;
  try {
    for await (const chunk of stream) {
      const text2 = decoder.write(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      for (const part of text2.split(/(?<=\n)/)) {
        if (!dropping) line += part;
        if (Buffer.byteLength(line) > maxBytes) {
          line = "";
          dropping = true;
        }
        if (part.endsWith("\n")) {
          if (!dropping) {
            let event;
            try {
              event = JSON.parse(line);
            } catch {
            }
            if (record(event)) onEvent(event);
          }
          line = "";
          dropping = false;
        }
      }
    }
  } catch (error) {
    if (!stream.destroyed) throw error;
  }
}
function progressLine(content) {
  const text2 = typeof content === "string" ? content : Array.isArray(content) ? content.flatMap((block) => record(block) && block.type === "text" && typeof block.text === "string" ? [block.text] : []).join("") : "";
  const value = text2.trim();
  return value.startsWith("{") || value.startsWith("```") ? "" : value.slice(0, 500);
}
function finalHandoff(text2, maxBytes) {
  if (Buffer.byteLength(text2) > maxBytes) throw new Error("Final handoff exceeds the configured text limit");
  let parsed;
  try {
    parsed = JSON.parse(text2.replace(/^```(?:json)?\s*|\s*```$/g, ""));
  } catch {
    return { message: text2, files: [], handoffs: [], needsUser: "" };
  }
  if (!record(parsed) || typeof parsed.message !== "string" || !Array.isArray(parsed.files) || !Array.isArray(parsed.handoffs)) {
    throw new Error("Final handoff must contain message, files, and handoffs");
  }
  if (parsed.needsUser !== void 0 && typeof parsed.needsUser !== "string") throw new Error("Final needsUser must be a string");
  const files = parsed.files.map((value) => {
    if (typeof value !== "string") throw new Error("Final file names must be strings");
    return outputName(value);
  });
  const handoffs = parsed.handoffs.map((value) => {
    if (!record(value) || typeof value.employeeId !== "string" || typeof value.message !== "string") throw new Error("Final handoff recipients and messages must be strings");
    return { employeeId: value.employeeId, message: value.message };
  });
  return { message: parsed.message, files, handoffs, needsUser: parsed.needsUser?.trim() ?? "" };
}
function createExecutor(ctx, config) {
  const nativeEnvironment = async (employee) => {
    const env = {};
    const references = employee.apiKeyEnv ? [employee.apiKeyEnv] : employee.engine === "claude" ? ["ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "CLAUDE_CODE_OAUTH_TOKEN"] : ["OPENAI_API_KEY"];
    for (const reference of references) {
      const credential = await ctx.credentials.resolve(credentialRef(reference));
      if (credential !== void 0) env[reference] = credential.value;
    }
    return env;
  };
  const probe = async (argv) => {
    try {
      const child = ctx.subprocess.spawn({
        argv: [...argv, "--version"],
        cwd: process.cwd(),
        stdio: { stdin: "ignore", stdout: { maxBytes: config.maxTextBytes }, stderr: { maxBytes: config.maxTextBytes } },
        signal: AbortSignal.timeout(config.disposeGraceMs * 4),
        graceMs: config.disposeGraceMs
      });
      const outcome = await child.done;
      return { available: outcome.exitCode === 0, version: child.collected.stdout?.readFrom(0).text.trim() ?? "" };
    } catch {
      return { available: false, version: "Executable unavailable" };
    }
  };
  const codexApp = async () => {
    if (process.platform !== "win32") return null;
    try {
      const child = ctx.subprocess.spawn({
        argv: [
          "powershell.exe",
          "-NoProfile",
          "-NonInteractive",
          "-Command",
          "(Get-AppxPackage -Name OpenAI.Codex | Sort-Object Version -Descending | Select-Object -First 1).InstallLocation"
        ],
        cwd: process.cwd(),
        stdio: { stdin: "ignore", stdout: { maxBytes: 4096 }, stderr: { maxBytes: 4096 } },
        signal: AbortSignal.timeout(config.disposeGraceMs * 4),
        graceMs: config.disposeGraceMs
      });
      const outcome = await child.done;
      const location = child.collected.stdout?.readFrom(0).text.trim() ?? "";
      return outcome.exitCode === 0 && location ? join5(location, "app", "resources", "codex.exe") : null;
    } catch {
      return null;
    }
  };
  const codexCommand = commandResolver(config.codexCommand, codexApp);
  const claudeCommand = commandResolver(config.claudeCommand, () => Promise.resolve(null));
  return {
    async health() {
      const [claude, codex] = await Promise.all([claudeCommand().then(probe), codexCommand().then(probe)]);
      const harness = await stat3(config.dshBin).then(
        (value) => ({ available: value.isFile(), version: "Local Harness SDK" }),
        () => ({ available: false, version: "Build the dsh CLI first" })
      );
      return { claude, codex, harness };
    },
    async run(employee, project, task, signal, execution) {
      const cwd = employee.cwd || project.cwd;
      const env = await nativeEnvironment(employee);
      signal.throwIfAborted();
      if (employee.engine === "harness" || employee.engine === "compatible") {
        const home = resolve4(config.storageRoot, "employees", employee.id);
        await mkdir4(home, { recursive: true, mode: 448 });
        const patches = [];
        const permissionPatch = join5(home, "permissions.patch.json");
        await writeFile4(permissionPatch, JSON.stringify([
          { id: "sdk-jsonrpc-server", config: { resumePersistedSessions: true } },
          { id: "sandbox-policy", config: { mode: employee.permission === "full-access" ? "danger-full-access" : employee.permission, workspaceRoot: cwd } },
          { id: "approval", config: { policy: employee.permission === "full-access" ? "never" : "ask" } }
        ]), { mode: 384 });
        patches.push(permissionPatch);
        if (employee.engine === "compatible") {
          if (!env[employee.apiKeyEnv]) throw new Error(`Missing credential reference: ${employee.apiKeyEnv}`);
          const path = join5(home, "provider.patch.json");
          await writeFile4(path, JSON.stringify([{ id: "llm-pi-ai", config: { providers: {
            "studio-provider": {
              api: "openai-completions",
              baseURL: employee.baseURL,
              apiKeyEnv: employee.apiKeyEnv,
              ...employee.thinkingFormat === "none" ? {} : { compat: { thinkingFormat: employee.thinkingFormat } },
              models: [{
                id: employee.model,
                name: employee.model,
                contextWindow: employee.contextWindow,
                maxTokens: employee.maxTokens,
                reasoningEfforts: employee.effort ? { [employee.effort]: employee.effort } : false
              }]
            }
          } } }]), { mode: 384 });
          patches.push(path);
        } else {
          const credential = await ctx.credentials.resolve(credentialRef(employee.apiKeyEnv || "DEEPSEEK_API_KEY"));
          if (credential !== void 0) env.DEEPSEEK_API_KEY = credential.value;
        }
        const harness = new DeepSeekHarness({
          dshBin: config.dshBin,
          dshHome: home,
          profile: "sdk",
          patches,
          cwd,
          processCwd: cwd,
          env: { ...scrubbedParentEnv(), ...env },
          provider: employee.engine === "compatible" ? "studio-provider" : "deepseek-official",
          ...employee.model ? { model: employee.model } : {},
          ...employee.effort ? { reasoningEffort: employee.effort } : {},
          maxTokens: employee.maxTokens,
          initializeTimeoutMs: config.disposeGraceMs * 20,
          disposeGraceMs: config.disposeGraceMs
        });
        const cancel = () => {
          void harness.close().catch(() => {
          });
        };
        signal.addEventListener("abort", cancel, { once: true });
        try {
          signal.throwIfAborted();
          const sessionId = execution.resumeSessionId ?? randomUUID6();
          const result = await harness.run(task.assignment, { sessionId, onNotification: (notification) => {
            const event = notification.method === "session.event" ? notification.params.event : void 0;
            if (!record(event) || event.type !== "assistant/message" || !record(event.data) || !record(event.data.message)) return;
            const text2 = progressLine(event.data.message.content);
            if (text2) execution.progress?.(text2);
          } });
          await execution.recordSession(result.sessionId);
          const reason = result.events.findLast((event) => event.type === "turn/end");
          if (reason?.type !== "turn/end" || reason.data.reason.kind !== "completed") throw new Error(`Harness task ended: ${reason?.type === "turn/end" ? reason.data.reason.kind : "missing completion"}`);
          return finalHandoff(result.finalResponse, config.maxTextBytes);
        } finally {
          signal.removeEventListener("abort", cancel);
          await harness.close();
        }
      }
      const privateRoot = join5(config.storageRoot, "native-runs");
      await mkdir4(privateRoot, { recursive: true, mode: 448 });
      const dir = await mkdtemp(join5(privateRoot, "run-"));
      const command = employee.engine === "claude" ? await claudeCommand() : await codexCommand();
      try {
        const schemaPath = join5(dir, "result-schema.json");
        const resultPath = join5(dir, "final.json");
        await writeFile4(schemaPath, JSON.stringify(resultSchema), { flag: "wx", mode: 384 });
        const argv = employee.engine === "claude" ? [
          ...command,
          "--print",
          "--output-format",
          "stream-json",
          "--verbose",
          "--json-schema",
          JSON.stringify(resultSchema),
          "--permission-mode",
          employee.permission === "read-only" ? "plan" : employee.permission === "full-access" ? "bypassPermissions" : "acceptEdits"
        ] : [
          ...command,
          "exec",
          "--sandbox",
          employee.permission === "full-access" ? "danger-full-access" : employee.permission,
          ...execution.resumeSessionId ? ["resume", execution.resumeSessionId] : [],
          "--skip-git-repo-check",
          "--json",
          "-c",
          'approval_policy="never"',
          "--output-schema",
          schemaPath,
          "--output-last-message",
          resultPath
        ];
        const claudeSession = execution.resumeSessionId ?? randomUUID6();
        if (employee.engine === "claude") argv.push(...execution.resumeSessionId ? ["--resume", claudeSession] : ["--session-id", claudeSession, "--name", `${project.name} \xB7 ${employee.name}`]);
        if (employee.model) argv.push(employee.engine === "claude" ? "--model" : "-m", employee.model);
        if (employee.effort) argv.push(...employee.engine === "claude" ? ["--effort", employee.effort] : ["-c", `model_reasoning_effort="${employee.effort}"`]);
        if (employee.engine === "codex") argv.push("-");
        const child = ctx.subprocess.spawn({
          argv,
          cwd,
          env,
          signal,
          graceMs: config.disposeGraceMs,
          stdio: { stdin: { data: task.assignment }, stdout: "pipe", stderr: { maxBytes: config.maxTextBytes } }
        });
        let finished = false;
        let lingering;
        const finish = () => {
          finished = true;
          lingering ??= setTimeout(() => {
            child.terminate();
          }, config.completionGraceMs);
        };
        let codexSession = null;
        let claudeResult = null;
        let failure = "";
        const stream = child.stdout ? jsonLines(child.stdout, config.maxTextBytes * 4, (event) => {
          if (employee.engine === "codex") {
            if (event.type === "thread.started" && typeof event.thread_id === "string") codexSession ??= event.thread_id;
            else if (event.type === "item.completed" && record(event.item) && event.item.type === "agent_message" && typeof event.item.text === "string") {
              const text2 = progressLine(event.item.text);
              if (text2) execution.progress?.(text2);
            } else if (event.type === "turn.completed") finish();
            else if (event.type === "turn.failed" && record(event.error) && typeof event.error.message === "string") failure = event.error.message;
            else if (event.type === "error" && typeof event.message === "string") failure ||= event.message;
          } else if (event.type === "assistant" && record(event.message)) {
            const text2 = progressLine(event.message.content);
            if (text2) execution.progress?.(text2);
          } else if (event.type === "result") {
            claudeResult = event;
            finish();
          }
        }) : Promise.resolve();
        void stream.catch(() => {
        });
        const outcome = await (async () => {
          try {
            return await child.done;
          } finally {
            clearTimeout(lingering);
            child.terminate();
            if (!await child.waitForExit(AbortSignal.timeout(config.disposeGraceMs * 4))) throw new Error(`${employee.engine} process cleanup did not complete`);
            if (finished) child.stdout?.destroy();
            await stream;
          }
        })();
        if (codexSession) await execution.recordSession(codexSession);
        signal.throwIfAborted();
        if (outcome.exitCode !== 0 && !finished) {
          throw new Error(`${employee.engine} exited with code ${String(outcome.exitCode)}. ${failure ? `${employee.engine} reported: ${failure.slice(0, 1e3)}` : "Check native login, model, effort, and permissions."}`);
        }
        if (employee.engine === "codex") return finalHandoff(await readFile3(resultPath, "utf8"), config.maxTextBytes);
        const raw = claudeResult;
        if (!raw || raw.is_error === true) {
          const reported = raw && typeof raw.result === "string" && raw.result ? `Claude Code reported: ${raw.result.slice(0, 1e3)}` : "Check native login and permissions.";
          throw new Error(`Claude Code did not complete the task. ${reported}`);
        }
        if (typeof raw.session_id !== "string" || raw.session_id !== claudeSession) throw new Error("Claude Code returned an unexpected session identity");
        await execution.recordSession(raw.session_id);
        const final = raw.structured_output !== void 0 ? JSON.stringify(raw.structured_output) : raw.result;
        if (typeof final !== "string") throw new Error("Claude Code returned no final handoff");
        return finalHandoff(final, config.maxTextBytes);
      } catch (error) {
        throw explainSpawnError(error, employee.engine === "claude" ? "claude" : "codex", command[0] ?? "");
      } finally {
        await rm2(dir, { recursive: true, force: true });
      }
    }
  };
}

// src/catalog.ts
import { readFile as readFile4 } from "node:fs/promises";
import { join as join6 } from "node:path";
function object(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
async function modelCatalog(ctx, codexHome, config) {
  let codex = [];
  let text2;
  try {
    text2 = await readFile4(join6(codexHome, "models_cache.json"), "utf8");
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
  if (text2 !== void 0) {
    const raw = JSON.parse(text2);
    if (!object(raw) || !Array.isArray(raw.models)) throw new Error("Native Codex model cache is invalid");
    codex = raw.models.flatMap((value) => {
      if (!object(value) || typeof value.slug !== "string" || value.visibility === "hide") return [];
      const efforts = Array.isArray(value.supported_reasoning_levels) ? value.supported_reasoning_levels.flatMap((level) => object(level) && typeof level.effort === "string" ? [level.effort] : []) : [];
      return [{ id: value.slug, name: typeof value.display_name === "string" ? value.display_name : value.slug, efforts, imageInput: null }];
    });
  }
  const harness = await ctx.llm.listModels("deepseek-official");
  const models = await Promise.all(harness.map(async (model) => {
    const info = await ctx.llm.resolveModelInfo("deepseek-official", model.id);
    return { id: model.id, name: model.name, efforts: info.reasoning?.efforts.map((effort) => effort.id) ?? [], imageInput: info.inputModalities?.includes("image") ?? false };
  }));
  let claude = [];
  let claudeError = "";
  try {
    const request = { type: "control_request", request_id: "studio-models", request: { subtype: "initialize" } };
    const child = ctx.subprocess.spawn({
      argv: [...config.claudeCommand, "--print", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--no-session-persistence"],
      cwd: process.cwd(),
      signal: AbortSignal.timeout(config.disposeGraceMs * 4),
      graceMs: config.disposeGraceMs,
      stdio: { stdin: { data: `${JSON.stringify(request)}
` }, stdout: { maxBytes: config.maxTextBytes * 2 }, stderr: { maxBytes: config.maxTextBytes } }
    });
    try {
      const outcome = await child.done;
      if (outcome.exitCode !== 0) throw new Error("Claude model discovery failed; check the installed CLI and login");
      for (const line of (child.collected.stdout?.readFrom(0).text ?? "").split("\n").filter(Boolean)) {
        const message = JSON.parse(line);
        if (!object(message) || message.type !== "control_response" || !object(message.response) || message.response.request_id !== "studio-models") continue;
        const response = message.response.response;
        if (!object(response) || !Array.isArray(response.models)) throw new Error("Claude returned an invalid model list");
        claude = response.models.map((value) => {
          if (!object(value) || typeof value.value !== "string" || typeof value.displayName !== "string") throw new Error("Claude returned an invalid model entry");
          const efforts = Array.isArray(value.supportedEffortLevels) ? value.supportedEffortLevels.filter((effort) => typeof effort === "string") : [];
          return { id: value.value, name: value.displayName, efforts, imageInput: null };
        });
      }
      if (!claude.length) throw new Error("Claude returned no selectable models; enter an exact model ID or check the CLI");
    } finally {
      child.terminate();
      if (!await child.waitForExit(AbortSignal.timeout(config.disposeGraceMs * 4))) throw new Error("Claude model discovery cleanup did not complete");
    }
  } catch (error) {
    claudeError = error instanceof Error ? error.message : "Claude model discovery unavailable";
  }
  return { codex, claude, claudeError, harness: models };
}

// src/index.ts
var name = "dsh-w-studio";
var inject = ["connection", "subprocess", "credentials", "llm"];
var Config = z3.object({
  storageRoot: z3.string().default(resolve5(resolveDshHome(), "studio")),
  claudeCommand: z3.array(z3.string().min(1)).min(1).default(["claude"]),
  codexCommand: z3.array(z3.string().min(1)).min(1).default(["codex"]),
  dshBin: z3.string().default(""),
  maxParallel: z3.natural().min(1).max(16).default(2),
  maxTasksPerProject: z3.natural().min(1).max(1e3).default(100),
  maxTextBytes: z3.natural().min(1024).max(1e5).default(65536),
  maxArtifactBytes: z3.natural().min(1024).default(16777216),
  maxRequestBytes: z3.natural().min(1024).default(262144),
  taskTimeoutMs: z3.natural().min(1e3).max(2147483647).default(36e5),
  disposeGraceMs: z3.natural().min(100).max(6e4).default(3e3),
  pollIntervalMs: z3.natural().min(250).max(6e4).default(1500),
  completionGraceMs: z3.natural().min(100).max(6e5).default(3e4)
});
async function apply(ctx, config) {
  const resolved = { ...config, storageRoot: resolve5(config.storageRoot), dshBin: resolve5(config.dshBin || installedDshBin()) };
  const executor = createExecutor(ctx, resolved);
  const studio = await Studio.open(resolved, executor);
  ctx.effect(() => () => studio.close(), "studio: employee operations");
  const reply = (value, status = 200) => Response.json(value, { status, headers: { "cache-control": "no-store" } });
  ctx.connection.fetch.register({
    path: "/api/studio/state",
    methods: ["GET"],
    requestBody: "buffered",
    fetch: () => Promise.resolve(reply({ state: studio.snapshot(), progress: studio.progress(), pollIntervalMs: config.pollIntervalMs }))
  });
  ctx.connection.fetch.register({
    path: "/api/studio/health",
    methods: ["GET"],
    requestBody: "buffered",
    fetch: async () => reply(await executor.health())
  });
  ctx.connection.fetch.register({
    path: "/api/studio/catalog",
    methods: ["GET"],
    requestBody: "buffered",
    fetch: async () => {
      try {
        return reply(await modelCatalog(ctx, process.env.CODEX_HOME || resolve5(homedir2(), ".codex"), resolved));
      } catch (error) {
        return reply({ error: error instanceof Error ? error.message : "Model catalog unavailable" }, 400);
      }
    }
  });
  ctx.connection.fetch.register({
    path: "/api/studio/command",
    methods: ["POST"],
    requestBody: "streaming",
    fetch: async (request) => {
      try {
        const reader = request.body?.getReader();
        const chunks = [];
        let size = 0;
        if (reader) {
          try {
            while (true) {
              const chunk = await reader.read();
              if (chunk.done) break;
              size += chunk.value.byteLength;
              if (size > config.maxRequestBytes) {
                await reader.cancel();
                return reply({ error: "Studio request exceeds the configured limit" }, 413);
              }
              chunks.push(chunk.value);
            }
          } finally {
            reader.releaseLock();
          }
        }
        const text2 = Buffer.concat(chunks).toString("utf8");
        const state = await studio.command(JSON.parse(text2));
        return reply({ state });
      } catch (error) {
        return reply({ error: error instanceof Error ? error.message : "Studio command failed" }, 400);
      }
    }
  });
  ctx.connection.fetch.register({
    path: "/api/studio/artifact",
    methods: ["GET"],
    requestBody: "buffered",
    fetch: async (request) => {
      try {
        const id2 = new URL(request.url).searchParams.get("id") ?? "";
        const { artifact, bytes } = await studio.artifact(id2);
        return new Response(new Uint8Array(bytes), { headers: {
          "content-type": "application/octet-stream",
          "cache-control": "no-store",
          "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(artifact.name.split(/[\\/]/).at(-1) ?? "result")}`
        } });
      } catch (error) {
        return reply({ error: error instanceof Error ? error.message : "Result file unavailable" }, 404);
      }
    }
  });
}
function installedDshBin() {
  const manifestPath = createRequire(import.meta.url).resolve("@deepseek-ai/dsh/package.json");
  const manifest2 = JSON.parse(readFileSync2(manifestPath, "utf8"));
  if (typeof manifest2 !== "object" || manifest2 === null || !("bin" in manifest2)) throw new Error("Installed Harness declares no CLI entry; configure dshBin");
  const bin = manifest2.bin;
  const entry = typeof bin === "string" ? bin : typeof bin === "object" && bin !== null && "dsh" in bin ? bin.dsh : void 0;
  if (typeof entry !== "string" || !entry) throw new Error("Installed Harness declares no dsh executable; configure dshBin");
  return resolve5(dirname4(manifestPath), entry);
}
export {
  Config,
  apply,
  inject,
  name
};
